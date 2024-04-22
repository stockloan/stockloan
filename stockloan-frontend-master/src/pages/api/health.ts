// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { readFileSync } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
// ----------------------------------------------------------------------

export default function health(req: NextApiRequest, res: NextApiResponse) {
  const {
    NEXT_PUBLIC_ADMIN_BETTER_SERVICE_URL,
    NEXT_PUBLIC_PAXNET_SERVICE_URL,
  } = process.env;
  res.status(200).json({
    status: 'UP',
    buildId: getBuildId(),
    apiUrl: {
      better: NEXT_PUBLIC_ADMIN_BETTER_SERVICE_URL,
      paxnet: NEXT_PUBLIC_PAXNET_SERVICE_URL,
    },
  });
}

function getBuildId() {
  let buildId;
  const { NODE_ENV } = process.env;
  switch (NODE_ENV) {
    case 'production':
      try {
        buildId = readFileSync('.next/BUILD_ID', 'utf8');
      } catch (e) {
        buildId = '';
      }
      break;
    default:
      buildId = '';
      break;
  }
  return buildId;
}
