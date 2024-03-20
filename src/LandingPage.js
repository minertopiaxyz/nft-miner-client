import { useEffect, useState } from "react";
import { FaBalanceScale } from "react-icons/fa";
import { BiSolidBank } from "react-icons/bi";
import { TbPick } from "react-icons/tb";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { MdForum } from "react-icons/md";

const Lib = require('./Lib');
const { openUrl, setStorageValue } = Lib;
const client = require('./client.json');
const Dapp = require("./contracts/Dapp");
const {
  CHAIN_ID,
  PROVIDER_URL,
  projectName,
  projectDesc,
  blockchainName,
  heroImgUrl,
  heroBgUrl,
  tokenName,
  tokenSymbol,
  // dashboardUrl,
  twitterLink,
  telegramLink,
  githubLink,
  emailLink,
  forumLink,
  // swapUrl,
  chartUrl,
  nftMaxSupply,
  coinUrl,
  ethSymbol
} = client;

function LandingPage() {
  const [LPD, setLPD] = useState({ price: '0.0', apy: '0' });
  useEffect(() => {
    let DAPP = new Dapp(CHAIN_ID);
    const initDapp = async () => {
      try {
        await DAPP.loadPrivateKey(null, PROVIDER_URL);
        await DAPP.initContracts();
        const data = await DAPP.getLandingPageData();
        console.log(data);
        setLPD(data);
      } catch (err) {
        console.error(err);
      }
    }

    const cleanUpDapp = async () => {
      await DAPP.cleanUp();
      DAPP = undefined;
    }

    initDapp();
    return () => {
      cleanUpDapp();
    }
  }, []);

  const tokenPrice = LPD.price ? LPD.price : '0.0';
  const apy = LPD.apy ? LPD.apy : '0';

  const openPage = (page) => {
    const toDashboard = async (page) => {
      await setStorageValue('SCREEN', 'DASHBOARD');
      const url = Lib.getBaseURL() + '?tab=' + page;
      Lib.openUrl(url);
    }
    if (page === 'forum') openUrl(forumLink);
    else if (page === 'chart') openUrl(chartUrl);
    else if (page === 'contract') openUrl(coinUrl);
    else toDashboard(page);
  }

  const heroBg = 'url(' + heroBgUrl + ')'; // 'url(https://res.cloudinary.com/dmyum8dv5/image/upload/c_scale,w_800/h5b4qlteq189aakezs3i)';
  const heroTitle = projectName.toUpperCase();
  const heroDesc = projectDesc;
  const heroBtnDesc = 'Mint NFT';
  const heroBtnDesc2 = 'Manage NFT';

  const title2 = 'Citizen Miner';
  const title4 = tokenName + ' ' + tokenSymbol;

  const features = [
    {
      ico: (<MdOutlineManageAccounts size='64' />), title: 'Small but Strong Nation',
      msg: 'Own Your Stake in the Revolution: Only Maximum ' + nftMaxSupply + ' NFT Citizen Will Build a Digital Future'
    },
    {
      ico: (<TbPick size='64' />), title: 'Citizen Only Miner',
      msg: 'Forge a New Economy: Every Citizen-Miner Builds a Stronger Digital Nation'
    },
    {
      ico: (<FaBalanceScale size='64' />), title: 'Socialism',
      msg: 'Distribution According to Need, Not Greed: Every Citizen Receives a Basic Income of 30% Minted Token.'
    },
    {
      ico: (<BiSolidBank size='64' />), title: 'Meritocracy',
      msg: 'From Each According to Contribution: All Citizens Shared the Remaining 70% Minted Token Based on Their Participation.'
    }
  ];

  const title3 = 'Economic Engine';
  const posStakeMsg = `
  In our digital nation, a trustless and permissionless system empowers all citizens to break free from centralized control. We leverage DeFi and staking to cultivate a thriving, collectively-owned cryptocurrency engine. Every contribution, from NFT minting to citizen participation, strengthens the collective good. Open access ensures everyone can build a brighter future. The yield generated by our collective efforts fuels strategic buybacks, removing national coin from circulation and fortifying its value. This directly benefits every citizen, a testament to our system built on shared prosperity. Join us, comrades, and be part of this digital utopia – a future where we all control our destiny!
  `;

  return (
    <>
      <div className="hero min-h-screen" style={{
        backgroundImage: heroBg
      }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content px-4">
          <div className="flex flex-grow flex-col max-w-4xl items-center">
            <img src={heroImgUrl}
              className="object-cover aspect-square rounded-box w-1/5"
              alt={heroTitle} />
            <h1 className="text-3xl md:text-5xl font-bold">{heroTitle}</h1>
            <p className="py-6">
              {heroDesc}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="btn btn-primary w-52" onClick={() => openPage('mint')}>{heroBtnDesc}</button>
              <button className="btn btn-neutral w-52" onClick={() => openPage('manage')}>{heroBtnDesc2}</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center py-16 bg-base-300 px-4">
        <div className="flex flex-grow flex-col max-w-4xl">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center">{title2}</h2>
          <div className="grid auto-rows-fr grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((item, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                  {item.ico}
                  <h3 className="card-title">{item.title}</h3>
                  <p>{item.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center py-16 bg-base-200 px-4">
        <div className="flex flex-grow flex-col max-w-4xl">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center">{title3}</h2>
          <p className="text-center">
            {posStakeMsg}
          </p>
        </div>
      </div>
      <div className="flex justify-center py-16 bg-base-200 px-4">
        <div className="flex flex-grow flex-col max-w-4xl">

          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center">{title4}</h2>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center md:text-left">
              <div className="stats text-primary-content stats-vertical md:stats-horizontal text-sm md:text-md">
                <div className="stat">
                  <div className="stat-title">${tokenSymbol} Price</div>
                  <div className="font-bold lg:stat-value">{tokenPrice} {ethSymbol}</div>
                  <div className="stat-actions flex flex-col md:flex-row gap-2">
                    <button
                      onClick={() => openPage('swap')}
                      className="btn btn-sm btn-primary">Buy {tokenSymbol}</button>
                    <button
                      onClick={() => openPage('chart')}
                      className="btn btn-sm">Price Chart</button>
                    <button
                      onClick={() => openPage('contract')}
                      className="btn btn-sm">Verify Contract</button>
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Stake ${tokenSymbol} earn ${tokenSymbol}</div>
                  <div className="font-bold lg:stat-value">{apy}% APY</div>
                  <div className="stat-actions flex flex-col md:flex-row">
                    <button className="btn btn-sm" onClick={() => openPage('vault')}>Staking Vault</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer p-10 bg-neutral text-neutral-content">
        <aside>
          <img width='50' height='50'
            alt={projectName} src='https://res.cloudinary.com/dvcj4ybil/image/upload/f_auto,q_auto/ndktv0scdrq2u9izcip8' />
          <p>{projectName}<br />Live on {blockchainName}</p>
        </aside>
        <nav>
          <h6 className="footer-title">Community</h6>
          <div className="grid grid-flow-col gap-4">
            <a href={twitterLink}><FaTwitter size='24' /></a>
            <a href={telegramLink}><FaTelegramPlane size='24' /></a>
            <a href={githubLink}><FaGithub size='24' /></a>
            <a href={emailLink}><SiGmail size='24' /></a>
            <a href={forumLink}><MdForum size='24' /></a>
          </div>
        </nav>
      </footer>
    </>
  );
}

export default LandingPage;
