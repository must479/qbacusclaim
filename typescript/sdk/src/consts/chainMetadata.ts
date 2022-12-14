import { ChainName } from '../types';

/**
 * A Chain and its characteristics
 */
export type ChainMetadata = {
  id: number;
  finalityBlocks: number;
  nativeTokenDecimals?: number;
  paginate?: RpcPagination;
  // The CoinGecko API expects, in some cases, IDs that do not match
  // ChainNames.
  gasCurrencyCoinGeckoId?: string;
};

/**
 * RPC Pagination information
 */
export interface RpcPagination {
  blocks: number;
  from: number;
}

// IDs can be generated in many ways-- for example, in JS:
// > Array.from('celo').map((c, i) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
// '63656c6f'

/**
 * Mainnets
 */
export const celo: ChainMetadata = {
  id: 0x63656c6f, // b'celo' interpreted as an int
  finalityBlocks: 0,
};

export const ethereum: ChainMetadata = {
  id: 0x657468, // b'eth' interpreted as an int
  finalityBlocks: 20,
};

export const arbitrum: ChainMetadata = {
  id: 0x617262, // b'arb' interpreted as an int
  finalityBlocks: 0,
  gasCurrencyCoinGeckoId: 'ethereum', // ETH is used for gas
};

export const optimism: ChainMetadata = {
  id: 0x6f70, // b'op' interpreted as an int
  finalityBlocks: 0,
  gasCurrencyCoinGeckoId: 'ethereum', // ETH is used for gas
};

export const bsc: ChainMetadata = {
  id: 0x627363, // b'bsc' interpreted as an int
  finalityBlocks: 15,
  gasCurrencyCoinGeckoId: 'binancecoin',
};

export const avalanche: ChainMetadata = {
  id: 0x61766178, // b'avax' interpreted as an int
  finalityBlocks: 3,
  paginate: {
    // Needs to be low to avoid RPC timeouts
    blocks: 100000,
    from: 6765067,
  },
  gasCurrencyCoinGeckoId: 'avalanche-2',
};

export const polygon: ChainMetadata = {
  id: 0x706f6c79, // b'poly' interpreted as an int
  finalityBlocks: 256,
  paginate: {
    // Needs to be low to avoid RPC timeouts
    blocks: 10000,
    from: 19657100,
  },
  gasCurrencyCoinGeckoId: 'matic-network',
};

/**
 * Testnets
 */
export const alfajores: ChainMetadata = {
  id: 1000,
  finalityBlocks: 0,
};

export const fuji: ChainMetadata = {
  id: 43113,
  finalityBlocks: 3,
};

export const goerli: ChainMetadata = {
  id: 5,
  finalityBlocks: 7,
};

export const kovan: ChainMetadata = {
  id: 3000,
  finalityBlocks: 7,
};

export const mumbai: ChainMetadata = {
  id: 80001,
  finalityBlocks: 32,
  paginate: {
    // eth_getLogs and eth_newFilter are limited to a 10,000 blocks range
    blocks: 10000,
    from: 22900000,
  },
};

const testChains = {
  test1: {
    id: 13371,
    finalityBlocks: 0,
  },
  test2: {
    id: 13372,
    finalityBlocks: 1,
  },
  test3: {
    id: 13373,
    finalityBlocks: 2,
  },
};

export const bsctestnet: ChainMetadata = {
  id: 0x62732d74, // b'bs-t' interpreted as an int
  finalityBlocks: 9,
};

export const arbitrumrinkeby: ChainMetadata = {
  id: 0x61722d72, // b'ar-r' interpreted as an int
  finalityBlocks: 0,
};

export const optimismkovan: ChainMetadata = {
  id: 0x6f702d6b, // b'op-k' interpreted as an int
  finalityBlocks: 0,
};

export const auroratestnet: ChainMetadata = {
  id: 0x61752d74, // b'au-t' interpreted as an int
  finalityBlocks: 1,
};

export const chainMetadata = {
  arbitrum,
  bsc,
  celo,
  ethereum,
  avalanche,
  optimism,
  polygon,
  alfajores,
  fuji,
  goerli,
  mumbai,
  kovan,
  bsctestnet,
  arbitrumrinkeby,
  optimismkovan,
  auroratestnet,
  ...testChains,
} as Record<ChainName, ChainMetadata>;
