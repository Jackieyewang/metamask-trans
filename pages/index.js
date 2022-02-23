import { Button, Layout, Row, Col, Card,Dropdown, Menu, Link} from "antd";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../components/wallet/connectors";
import { useState, useEffect } from "react"
import {getAllOwnedNFTs} from '../components/getNFT/getNFT.ts'
import ethlogo from '../image/ethlogo.svg';
import usdtlogo from '../image/usdtlogo.png';

const { Header, Footer, Sider, Content } = Layout;


export default function Home() {
  const [state, setState] = useState({
		loading: false,
		tokenChosenToSale: undefined,
		tokenChosenToPay: undefined,
	});
  const { active, account, library, connector, activate, deactivate } = useWeb3React()
	const [NFTsOfUser, setNftsOfUser] = useState([]);

  async function connect() {
    try {
      await activate(injected)
      localStorage.setItem('isWalletConnected', true)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
      localStorage.setItem('isWalletConnected', false)
    } catch (ex) {
      console.log(ex)
    }
  }
  console.log(account);
  async function getNftData() {
		const data = await getAllOwnedNFTs(account);
		setNftsOfUser(data);
	}

	useEffect(() => {
		getNftData();
	}, []);

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected)
          localStorage.setItem('isWalletConnected', true)
        } catch (ex) {
          console.log(ex)
        }
      }
    }
    connectWalletOnPageLoad()
  }, [])
  console.log(NFTsOfUser)

  const { tokenChosenToSale } = state;
	const { tokenChosenToPay } = state;
	const createMenuNodes = (menuList) => {
		return Object.values(menuList).map((item) => {
			const contractAddress = item.id.split(':')[0];
			const tokenId = item.id.split(':')[1];
			let tokenIdcut;
			if (tokenId.length > 6) {
				tokenIdcut = tokenId.substr(0, 5).concat('...');
			} else {
				tokenIdcut = tokenId;
			}
			return (
				<Menu.Item key={item.keys} className="NFTMenuItem">
					<Link
						onClick={() => {
							setState({
								...state,
								tokenChosenToSale: {
									contractAddress: contractAddress,
									tokenId: tokenId,
									type: 'ERC721',
								},
							});
						}}
					></Link>
					{contractAddress}:{tokenIdcut}
				</Menu.Item>
			);
		});
	};
  const menuTokenToSale = <Menu>{createMenuNodes(NFTsOfUser)}</Menu>;
	const menuTokenToPay = (
		<Menu>
			<Menu.Item className="NFTMenuItem">
				<Link
					onClick={() => {
						setState({
							...state,
							tokenChosenToPay: {
								name: 'eth',
								type: 'ERC20',
							},
						});
					}}
				></Link>
				<img src={ethlogo} style={{ width: '21px' }} />
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ETH
			</Menu.Item>
			<Menu.Item className="NFTMenuItem">
				<Link
					onClick={() => {
						setState({
							...state,
							tokenChosenToPay: {
								name: 'usdt',
								type: 'ERC20',
							},
						});
					}}
				></Link>
				<img src={usdtlogo} style={{ width: '21px' }} />
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; USDT
			</Menu.Item>
		</Menu>
	);

  return (
    <div className="Homecontent">
      <Layout>
        <Header>
        {!account ?
          <Button 
            type="primary"
            shape="round"
            onClick={connect}
          >
            Connect wallet
          </Button> :
          <Button 
          type="primary"
          shape="round"
          onClick={disconnect}
        >
          Disconnect
        </Button>}
          <span style={{
            marginLeft: "1100px",
          }}>
            {activate ? <span style={{color: 'white'}}><b>{account && account.substr(0, 10).concat('...')}</b> </span> : <span>Not connected</span>}
          </span>
        </Header>

        <Layout>
          <Content>
            <div className="indexContent">
              <Row gutter={16}>
                <Col span={8} offset={1}>
                  <Card
                    title="Trade"
                    bordered={false}
                    headStyle={{
                      backgroundColor: 'rgb(135, 22, 201)',
                      textAlign: 'left',
                      color: 'white',
                    }}
                    style={{marginTop:'20px'}}
                  >
                    {/* {Object.keys(NFTsOfUser)} */}
                    {/* <Dropdown
                      overlay={menuTokenToSale}
                      placement="bottomCenter"
                    > */}
                      <Button
                        type="primary"
                        shape="round"
                        size="large"
                        style={{ fontSize: '23px', height: '60px' }}
                      >
                        Choose the NFT you want to sell
                      </Button>
                    {/* </Dropdown> */}
                    {/* <Dropdown
                      overlay={menuTokenToPay}
                      placement="bottomCenter"
                    > */}
                      <Button
                        type="primary"
                        shape="round"
                        size="large"
                        style={{
                          backgroundColor: 'turquoise',
                          fontSize: '23px',
                          height: '60px',
                          marginTop: '30px',
                        }}
                      >
                        Choose the Token to exchange
                      </Button>
                    {/* </Dropdown> */}
                  </Card>
                </Col>
                <Col span={12} offset={1}>
                  <Card title="Showing Stand" bordered={false} style={{marginTop:'20px'}}>
                    <Card title="The ERC Token you choose to sale">
                      {/* {tokenChosenToSale} */}
                    </Card>
                  </Card>
                </Col>
              </Row>
            </div>
          </Content>
        </Layout>

      </Layout>
    </div>
  )
}
