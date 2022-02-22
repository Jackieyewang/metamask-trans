import { Button, Layout} from "antd";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../components/wallet/connectors";
import { useEffect } from "react"

const { Header, Footer, Sider, Content } = Layout;



export default function Home() {
  const { active, account, library, connector, activate, deactivate } = useWeb3React()

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
            
          </Content>
          {/* <Sider>Sider</Sider> */}
        </Layout>
      </Layout>
    </div>
  )
}
