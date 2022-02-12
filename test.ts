import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";

import { doc } from "./mod.ts";

Deno.test("doc", async () => {
	const importMap = new URL("./testdata/import_map.json", import.meta.url)
		.href;
	const moduleUrl = new URL("./testdata/mod.ts", import.meta.url)
		.href;
	const docNode = await doc(moduleUrl, {
		importMap,
	});
	assertEquals(docNode.length, 1);
	assertEquals(docNode[0].kind, "function");
	assertEquals(docNode[0].name, "setColorEnabled");
	assertEquals(docNode[0].location, {
		filename: "https://deno.land/std@0.125.0/fmt/colors.ts",
		line: 44,
		col: 0,
	});
});
