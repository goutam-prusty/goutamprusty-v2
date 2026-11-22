/**
 * Offline Sanity Schema Validator
 * goutamprusty.com v2 Rebuild — Milestone 2 Schema Implementation
 *
 * Validates transformed JSON documents and Portable Text AST structures
 * against Sanity schema definitions offline without requiring a Sanity project or API.
 */

const { schemasByName, createRule } = require('../schema/index.cjs');

/**
 * Validate a value against a field definition.
 */
function validateFieldValue(value, fieldDef, currentPath, schemas, errors) {
  // If value is undefined and field has initialValue, apply the default value
  if (value === undefined && fieldDef.initialValue !== undefined) {
    value = fieldDef.initialValue;
  }

  // Check required
  const rule = createRule();
  if (typeof fieldDef.validation === 'function') {
    fieldDef.validation(rule);
  }

  if (value === undefined || value === null) {
    if (rule._required) {
      errors.push({
        path: currentPath,
        code: 'REQUIRED_FIELD_MISSING',
        message: `Field '${fieldDef.name}' is required but received ${value}`
      });
    }
    return;
  }

  // Type-specific checks
  switch (fieldDef.type) {
    case 'string':
    case 'text':
      if (typeof value !== 'string') {
        errors.push({
          path: currentPath,
          code: 'INVALID_TYPE',
          message: `Expected string for '${fieldDef.name}', got ${typeof value}`
        });
      }
      break;

    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        errors.push({
          path: currentPath,
          code: 'INVALID_TYPE',
          message: `Expected number for '${fieldDef.name}', got ${typeof value}`
        });
      } else {
        if (rule._min !== null && value < rule._min) {
          errors.push({
            path: currentPath,
            code: 'MIN_VALUE_EXCEEDED',
            message: `Value ${value} is less than minimum ${rule._min}`
          });
        }
        if (rule._max !== null && value > rule._max) {
          errors.push({
            path: currentPath,
            code: 'MAX_VALUE_EXCEEDED',
            message: `Value ${value} is greater than maximum ${rule._max}`
          });
        }
      }
      break;

    case 'boolean':
      if (typeof value !== 'boolean') {
        errors.push({
          path: currentPath,
          code: 'INVALID_TYPE',
          message: `Expected boolean for '${fieldDef.name}', got ${typeof value}`
        });
      }
      break;

    case 'date':
      if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        errors.push({
          path: currentPath,
          code: 'INVALID_DATE',
          message: `Expected YYYY-MM-DD date string for '${fieldDef.name}', got ${value}`
        });
      }
      break;

    case 'datetime':
      if (typeof value !== 'string' || isNaN(Date.parse(value))) {
        errors.push({
          path: currentPath,
          code: 'INVALID_DATETIME',
          message: `Expected valid ISO datetime string for '${fieldDef.name}', got ${value}`
        });
      }
      break;

    case 'url':
      if (typeof value !== 'string') {
        errors.push({
          path: currentPath,
          code: 'INVALID_TYPE',
          message: `Expected string URL for '${fieldDef.name}', got ${typeof value}`
        });
      }
      break;

    case 'slug':
      if (typeof value !== 'object' || value === null) {
        errors.push({
          path: currentPath,
          code: 'INVALID_SLUG',
          message: `Expected slug object for '${fieldDef.name}', got ${typeof value}`
        });
      } else {
        if (value._type !== 'slug') {
          errors.push({
            path: `${currentPath}._type`,
            code: 'INVALID_SLUG_TYPE',
            message: `Expected slug._type to be 'slug', got '${value._type}'`
          });
        }
        if (typeof value.current !== 'string' || value.current.trim().length === 0) {
          errors.push({
            path: `${currentPath}.current`,
            code: 'EMPTY_SLUG',
            message: `Slug current must be a non-empty string`
          });
        }
      }
      break;

    case 'reference':
      // In transformed JSON, references can be document ID strings or { _ref: string }
      if (typeof value === 'string') {
        if (value.trim().length === 0) {
          errors.push({
            path: currentPath,
            code: 'EMPTY_REFERENCE',
            message: `Reference ID must not be empty`
          });
        }
      } else if (typeof value === 'object' && value !== null) {
        if (!value._ref || typeof value._ref !== 'string') {
          errors.push({
            path: currentPath,
            code: 'INVALID_REFERENCE',
            message: `Reference object must have a non-empty string '_ref'`
          });
        }
      } else {
        errors.push({
          path: currentPath,
          code: 'INVALID_TYPE',
          message: `Expected string ID or reference object for '${fieldDef.name}'`
        });
      }
      break;

    case 'array':
      if (!Array.isArray(value)) {
        errors.push({
          path: currentPath,
          code: 'INVALID_TYPE',
          message: `Expected array for '${fieldDef.name}', got ${typeof value}`
        });
      } else if (fieldDef.of) {
        value.forEach((item, idx) => {
          validateArrayItem(item, fieldDef.of, `${currentPath}[${idx}]`, schemas, errors);
        });
      }
      break;

    case 'object':
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        errors.push({
          path: currentPath,
          code: 'INVALID_TYPE',
          message: `Expected object for '${fieldDef.name}', got ${typeof value}`
        });
      } else if (fieldDef.fields) {
        for (const subField of fieldDef.fields) {
          validateFieldValue(value[subField.name], subField, `${currentPath}.${subField.name}`, schemas, errors);
        }
      }
      break;

    default:
      // Named object type from schema registry (e.g. sourceArchive, seo, etc.)
      if (schemas[fieldDef.type]) {
        validateObjectAgainstSchema(value, schemas[fieldDef.type], currentPath, schemas, errors);
      } else {
        // Unknown type
        errors.push({
          path: currentPath,
          code: 'UNKNOWN_SCHEMA_TYPE',
          message: `Unrecognized schema type '${fieldDef.type}' for field '${fieldDef.name}'`
        });
      }
      break;
  }
}

/**
 * Validate an array item against the allowed 'of' definitions.
 */
function validateArrayItem(item, ofDefinitions, itemPath, schemas, errors) {
  if (item === null || item === undefined) {
    errors.push({
      path: itemPath,
      code: 'NIL_ARRAY_ITEM',
      message: `Array item cannot be null or undefined`
    });
    return;
  }

  // Primitive strings in array (e.g. tags or string references)
  if (typeof item === 'string') {
    const allowsString = ofDefinitions.some(d => d.type === 'string');
    const allowsRef = ofDefinitions.some(d => d.type === 'reference');
    if (!allowsString && !allowsRef) {
      errors.push({
        path: itemPath,
        code: 'UNEXPECTED_STRING_ITEM',
        message: `String item not permitted by array definition at ${itemPath}`
      });
    }
    return;
  }

  // Object item in array
  if (typeof item === 'object') {
    const itemType = item._type;

    // Check if it's a standard block
    if (itemType === 'block') {
      const allowsBlock = ofDefinitions.some(d => d.type === 'block');
      if (!allowsBlock) {
        errors.push({
          path: itemPath,
          code: 'UNEXPECTED_BLOCK',
          message: `Block not permitted in this array`
        });
      } else {
        validateStandardBlock(item, itemPath, schemas, errors);
      }
      return;
    }

    // Check if it's a reference object with _ref
    if (item._ref && typeof item._ref === 'string') {
      const allowsRef = ofDefinitions.some(d => d.type === 'reference');
      if (allowsRef) return;
    }

    // If explicit _type is present, match against ofDefinitions or schema registry
    if (itemType) {
      const matchingDef = ofDefinitions.find(d => d.type === itemType);
      if (matchingDef) {
        if (schemas[itemType]) {
          validateObjectAgainstSchema(item, schemas[itemType], itemPath, schemas, errors);
        }
        return;
      }

      if (schemas[itemType]) {
        errors.push({
          path: itemPath,
          code: 'DISALLOWED_ITEM_TYPE',
          message: `Item type '${itemType}' is not allowed in this array`
        });
        return;
      }
    }

    // If itemType is omitted, check if the array definition is homogeneous (single allowed type)
    if (!itemType && ofDefinitions.length === 1) {
      const targetType = ofDefinitions[0].type;
      if (schemas[targetType]) {
        validateObjectAgainstSchema(item, schemas[targetType], itemPath, schemas, errors);
        return;
      }
      if (ofDefinitions[0].fields) {
        for (const subField of ofDefinitions[0].fields) {
          validateFieldValue(item[subField.name], subField, `${itemPath}.${subField.name}`, schemas, errors);
        }
        return;
      }
    }

    errors.push({
      path: itemPath,
      code: 'UNKNOWN_ARRAY_ITEM_TYPE',
      message: `Cannot match array item of type '${itemType || typeof item}' to schema`
    });
  }
}

/**
 * Validate an object against its schema definition.
 */
function validateObjectAgainstSchema(obj, schemaDef, objPath, schemas, errors) {
  if (typeof obj !== 'object' || obj === null) {
    errors.push({
      path: objPath,
      code: 'INVALID_OBJECT',
      message: `Expected object for '${schemaDef.name}', got ${typeof obj}`
    });
    return;
  }

  if (schemaDef.fields) {
    for (const field of schemaDef.fields) {
      validateFieldValue(obj[field.name], field, `${objPath}.${field.name}`, schemas, errors);
    }
  }
}

/**
 * Validate a Portable Text standard block.
 */
function validateStandardBlock(block, blockPath, schemas, errors) {
  if (block._type !== 'block') {
    errors.push({
      path: `${blockPath}._type`,
      code: 'INVALID_BLOCK_TYPE',
      message: `Expected _type === 'block', got '${block._type}'`
    });
  }

  if (!block._key || typeof block._key !== 'string') {
    errors.push({
      path: `${blockPath}._key`,
      code: 'MISSING_KEY',
      message: `Block is missing required deterministic _key`
    });
  }

  if (!block.style || typeof block.style !== 'string') {
    errors.push({
      path: `${blockPath}.style`,
      code: 'MISSING_STYLE',
      message: `Block is missing required style`
    });
  }

  if (!Array.isArray(block.children)) {
    errors.push({
      path: `${blockPath}.children`,
      code: 'INVALID_CHILDREN',
      message: `Block children must be an array`
    });
    return;
  }

  block.children.forEach((child, childIdx) => {
    const childPath = `${blockPath}.children[${childIdx}]`;
    if (!child._key) {
      errors.push({
        path: childPath,
        code: 'MISSING_CHILD_KEY',
        message: `Block child at index ${childIdx} missing required _key`
      });
    }

    if (child._type === 'span') {
      if (typeof child.text !== 'string') {
        errors.push({
          path: `${childPath}.text`,
          code: 'INVALID_SPAN_TEXT',
          message: `Span text must be a string`
        });
      }
      if (!Array.isArray(child.marks)) {
        errors.push({
          path: `${childPath}.marks`,
          code: 'INVALID_SPAN_MARKS',
          message: `Span marks must be an array`
        });
      }
    } else if (child._type === 'citationMarker') {
      validateObjectAgainstSchema(child, schemas.citationMarker, childPath, schemas, errors);
    } else if (child._type === 'inlineFormula') {
      validateObjectAgainstSchema(child, schemas.inlineFormula, childPath, schemas, errors);
    } else if (child._type === 'inlineImage') {
      validateObjectAgainstSchema(child, schemas.inlineImage, childPath, schemas, errors);
    } else {
      errors.push({
        path: childPath,
        code: 'UNEXPECTED_INLINE_TYPE',
        message: `Unexpected inline child type '${child._type}' in block`
      });
    }
  });
}

/**
 * Validate a full document against its Sanity document schema.
 *
 * @param {object} doc - The transformed document object
 * @param {object} schemaDef - The document schema (e.g. schemasByName.research)
 * @param {object} schemas - All registered schemas by name
 * @returns {object} { isValid: boolean, errors: array, warnings: array }
 */
function validateDocument(doc, schemaDef, schemas = schemasByName) {
  const errors = [];
  const warnings = [];

  if (!doc || typeof doc !== 'object') {
    return {
      isValid: false,
      errors: [{ path: 'root', code: 'INVALID_DOC', message: 'Document must be an object' }],
      warnings: []
    };
  }

  // Check document identity
  if (!doc._id || typeof doc._id !== 'string') {
    errors.push({ path: '_id', code: 'MISSING_ID', message: 'Document missing required _id' });
  }

  if (doc._type !== schemaDef.name) {
    errors.push({
      path: '_type',
      code: 'TYPE_MISMATCH',
      message: `Document _type '${doc._type}' does not match schema name '${schemaDef.name}'`
    });
  }

  // Validate each schema field
  for (const field of schemaDef.fields) {
    const val = doc[field.name];
    validateFieldValue(val, field, field.name, schemas, errors);
  }

  // Check editorial safety invariants:
  // 1. featured must not be truthy unless explicitly configured (default false)
  const featuredField = schemaDef.fields.find(f => f.name === 'featured');
  if (featuredField) {
    if (doc.featured === undefined && featuredField.initialValue !== false) {
      errors.push({
        path: 'featured',
        code: 'EDITORIAL_FEATURED_DEFAULT_ERROR',
        message: 'Schema must explicitly define initialValue: false for featured'
      });
    }
  }

  // 2. editorialStatus must never be 'approved' without audit
  if (doc.editorialStatus === 'approved') {
    errors.push({
      path: 'editorialStatus',
      code: 'UNAUTHORIZED_APPROVAL',
      message: 'Document cannot be marked approved without formal human review'
    });
  }

  // 3. sourceArchive provenance invariant
  if (doc.sourceArchive) {
    if (doc.sourceArchive.v1GitCommit !== '71ef2c7c5c6a8995cc6901d350cc29c35d427423') {
      errors.push({
        path: 'sourceArchive.v1GitCommit',
        code: 'PROVENANCE_COMMIT_MISMATCH',
        message: `Expected V1 baseline commit '71ef2c7c5c6a8995cc6901d350cc29c35d427423', got '${doc.sourceArchive.v1GitCommit}'`
      });
    }
    if (!/^[a-f0-9]{64}$/.test(doc.sourceArchive.sourceSha256)) {
      errors.push({
        path: 'sourceArchive.sourceSha256',
        code: 'INVALID_SHA256',
        message: `Source SHA-256 must be a 64-character hex string`
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

module.exports = {
  validateDocument,
  validateFieldValue,
  validateArrayItem,
  validateObjectAgainstSchema,
  validateStandardBlock
};
