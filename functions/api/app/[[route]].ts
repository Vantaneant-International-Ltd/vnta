// All /api/app/* requests. The logic lives in src/server/api.ts so tests can run it.
import { handle } from '../../../src/server/api.ts';

export const onRequest = (context: { request: Request; env: any }) => handle(context.request, context.env);
