function KeyFromPtsArray(array, indexer) {
	let key = '';
	let index;
	let sorted;
	let isIndexed = (indexer != null);

	if(isIndexed) {
		sorted = array.sort((a, b) => indexer.indexOf(a) - indexer.indexOf(b));
	} else {
		sorted = array.sort((a, b) => a - b);
	}

	for(let point of sorted) {
		if(isIndexed)
			index = indexer.indexOf(point);
		else
			index = point;

		key += '.'+String(index);
	}

	return key;
}