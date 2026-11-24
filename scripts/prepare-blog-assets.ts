import { syncBlogAssets } from './blog-assets';

const preview = process.argv.includes('--preview');
syncBlogAssets({ includeDrafts: preview, skipInvalidPosts: preview });
