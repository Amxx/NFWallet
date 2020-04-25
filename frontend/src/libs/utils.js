const toShortAddress = (entry) => `${entry.substr(0,6)}...${entry.substr(-4)}`;

export {
	toShortAddress
};
