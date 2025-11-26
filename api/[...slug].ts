import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getProviders } from '../../src/backend/providers/providers';
import { NotFoundError } from '@p-stream/providers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const providers = getProviders();
  const { slug } = req.query;

  if (!slug || !Array.isArray(slug) || slug.length === 0) {
    return res.status(404).json({ error: 'Not found' });
  }

  const [mainRoute, ...params] = slug;

  try {
    switch (mainRoute) {
      case 'sources':
        if (req.method === 'GET') {
          const sources = providers.listSources();
          return res.status(200).json(sources);
        }
        break;

      case 'embeds':
        if (req.method === 'GET') {
          const embeds = providers.listEmbeds();
          return res.status(200).json(embeds);
        }
        break;

      case 'metadata':
        if (req.method === 'GET' && params.length > 0) {
          const metadata = providers.getMetadata(params[0]);
          if (metadata) {
            return res.status(200).json(metadata);
          }
          return res.status(404).json({ error: 'Metadata not found' });
        }
        break;

      case 'run':
        if (req.method === 'POST') {
          const [runType] = params;
          switch (runType) {
            case 'source':
              const sourceResult = await providers.runSourceScraper(req.body);
              return res.status(200).json(sourceResult);
            case 'embed':
              const embedResult = await providers.runEmbedScraper(req.body);
              return res.status(200).json(embedResult);
            case 'all':
              const allResult = await providers.runAll(req.body);
              return res.status(200).json(allResult);
          }
        }
        break;
    }

    return res.status(405).json({ error: 'Method not allowed or route not found' });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unknown error occurred' });
  }
}
