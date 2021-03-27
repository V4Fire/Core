import type Cache from 'core/cache/interface';

export interface StorageManagerMemory {
	[key: string]: {
		value?: unknown;
		action: 'set' | 'remove';
		callback?(): void;
	};
}

export type StorageManagerChangeElementParams = {
	action: 'set';
	value: unknown;
	callback?(): void;
} | {
	action: 'remove';
	callback?(): void;
};

export interface ConnectorRemoveStorageOptions {
	target: 'storage';
}

export interface ConnectorRemoveCacheOrBothOptions {
	target: 'cache' | 'both';
}

export interface ConnectorSetStorageOptions extends ConnectorRemoveStorageOptions {
	ttl?: number;
}

export interface ConnectorSetCacheOrBothOptions extends ConnectorRemoveCacheOrBothOptions {
	ttl?: number;
}

export type CacheWithoutDirectMutations<V> = Omit<Cache<V>, 'set' | 'remove' | 'clear'>;
