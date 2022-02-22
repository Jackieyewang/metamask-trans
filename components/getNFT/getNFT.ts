import axios from 'axios';

export async function getAllOwnedNFTs(address: string, year?: string) {
	address = address.toLowerCase();
	const dataList: any[] = [];
	const size = 300;
	let preid = '';
	let continuation;
	while (dataList.length < 10000) {
		const reqData: any = {
			size,
			filter: {
				currency: '0x0000000000000000000000000000000000000000',
				hide: false,
				incoming: true,
				nsfw: true,
				owner: address,
				sort: 'LATEST',
				verifiedOnly: false,
			},
		};
		if (continuation) {
			reqData.continuation = continuation;
		}
		try {
			const res = await axios.post(
				'https://api-mainnet.rarible.com/marketplace/search/v1/ownerships',
				reqData
			);
			const curData = res.data;
			dataList.push(...curData);
			const curLen = curData.length;
			// console.log('curLen1');
			// console.log(curLen);
			if (curLen === size) {
				preid = curData[curLen - 1].id;
				// const preDate = new Date(curData[curLen - 1].date).getTime();
				// continuation = `${preDate}_${preid}`;
				const item = `https://api-mainnet.rarible.com/marketplace/api/v4/items/${preid.slice(
					0,
					preid.lastIndexOf(':')
				)}/ownerships`;
				const res = await axios.get(item);
				const params = new Date(res.data[0].date).getTime();
				continuation = `{"params":[${params},"${preid}"]}`;
				// console.log(continuation);
				if (year && params < new Date(year).getTime()) {
					break;
				}
			} else {
				break;
			}
		} catch (error) {
			console.log('getAllOwnedNFTs error');
			console.log(error);
		}
	}
	return dataList;
}
