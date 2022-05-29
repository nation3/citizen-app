import Image from 'next/image'
import Card from 'react-animated-3d-card'
import Flag from '../public/flag.svg'
import PassportArt from '../public/passport/art.svg'
import ContactlessIcon from '../public/passport/contactless.svg'
import IconPlain from '../public/passport/icon-plain.svg'
import LogoPlain from '../public/passport/logo-plain.svg'
import QR from '../public/passport/qr.svg'

/*export default function Passport({ holder, id, onClick }) {
  return (
    <Card
      style={{
        width: window.innerWidth > 390 ? '390px' : '320px',
        height: '500px',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={onClick}
    >
      <div className="bg-white absolute top-0 left-0 right-0 bottom-0 flex flex-col h-full">
        <div className="shrink h-20 flex align-middle px-4 justify-between items-center">
          <Image src={LogoPlain} width={120} height={50}></Image>
          <div className="text-right">
            <label className="uppercase text-xs text-gray-400 block">
              Passport number
            </label>
            <label className="text-md text-black justify-self-end block">
              {String(id).padStart(3, '0')}
            </label>
          </div>
        </div>
        <div className="shrink">
          <Image src={PassportArt} />
        </div>
        <div className="grow p-4">
          <div className="text-left">
            <label className="uppercase text-xs text-gray-400 block">
              Passport holder
            </label>
            <label className="text-md text-black justify-self-end block">
              {holder}
            </label>
          </div>
        </div>

        <div className="shrink flex justify-center">
          <Image src={QR} width={136} height={136} />
        </div>

        <div className="shrink h-12 px-4 flex align-middle px-4 justify-between items-center">
          <Image src={IconPlain} width={24} height={24}></Image>
          <Image src={ContactlessIcon} width={20} height={20}></Image>
        </div>
      </div>
    </Card>
  )
}*/

export default function Passport({ holder, id, nft, onClick }) {
  return (
    <Card
      style={{
        width: window.innerWidth > 390 ? '390px' : '320px',
        height: window.innerWidth > 390 ? '450px' : '369px',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={onClick}
    >
      <Image src={nft.image} layout="fill" />
    </Card>
  )
}
