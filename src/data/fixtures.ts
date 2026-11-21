/** Development-only layout fixtures. Replace with verified CMS content in a later phase. */
export const fixtureNotice = 'Development fixture — placeholder content for template review.';

export const works = [
  { title: 'Sample research report', summary: 'Placeholder summary for reviewing a long-form research listing.', href: '/research/sample-report/', type: 'Research' },
  { title: 'Sample article', summary: 'Placeholder summary for reviewing an editorial writing listing.', href: '/writing/sample-article/', type: 'Writing' },
  { title: 'Sample project', summary: 'Placeholder summary for reviewing a project case-study listing.', href: '/projects/sample-project/', type: 'Project', visualSlot: true },
];

export const topics = ['Sample topic one', 'Sample topic two', 'Sample topic three'];
export const topicSlug = (topic: string) => topic === topics[0] ? 'sample-topic' : topic.toLowerCase().replaceAll(' ', '-');
export const collections = [{ title: 'Sample series', summary: 'A placeholder collection for template review.', href: '/collections/sample-series/' }];
