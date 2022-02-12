import { doc } from "https://deno.land/x/deno_doc@v0.29.0/mod.ts";
import type { DocOptions } from "https://deno.land/x/deno_doc@v0.29.0/mod.ts";
import { ImportMap } from "https://esm.sh/@jspm/import-map@0.3.3";

export interface Options extends DocOptions {
	importMap?: string;
}

export async function createResolver(moduleUrl: string, importMap?: string) {
	const map = new ImportMap(moduleUrl, {});
	if (importMap) {
		const res = await fetch(importMap);
		if (res.status !== 200) {
			await res.arrayBuffer();
			throw new Error(
				"non 200 http status code received from importMap endpoint",
			);
		}
		const json = await res.json();
		map.extend(json);
	}
	return (specifier: string, ref: string) => {
		return map.resolve(specifier, ref) as string;
	};
}

export default async function (specifier: string, opts: Options = {}) {
	if (opts.importMap && !opts.resolve) {
		opts.resolve = await createResolver(specifier, opts.importMap);
	}
	return doc(specifier, opts);
}
