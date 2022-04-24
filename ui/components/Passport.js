import Image from 'next/image'
import Card from 'react-animated-3d-card'
import Flag from '../public/flag.svg'
import Icon from '../public/icon.svg'
import Logo from '../public/logo.svg'
import PassportArt1 from '../public/passport/art1.svg'
import PassportArt2 from '../public/passport/art2.svg'
import PassportArt3 from '../public/passport/art3.png'
import PassportArt4 from '../public/passport/art4.png'
import ContactlessIcon from '../public/passport/contactless.svg'

export default function Passport({ holder, id }) {
  return (
    <Card
      style={{
        width: window.innerWidth > 390 ? '390px' : '320px',
        height: '500px',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={() => console.log('Card clicked')}
    >
      <div className="bg-white absolute top-0 left-0 right-0 bottom-0 flex flex-col h-full">
        <div className="shrink h-20 flex align-middle px-4 justify-between items-center">
          <Image src={Logo}></Image>
          <div className="text-right">
            <label className="uppercase text-xs text-gray-400 block">
              Citizen number
            </label>
            <label className="text-md text-black justify-self-end block">
              {String(id).padStart(3, '0')}
            </label>
          </div>
        </div>
        <div className="shrink">
          <Image src={PassportArt3} />
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

        <div className="shrink h-12 px-4 flex align-middle px-4 justify-between items-center">
          <Image src={Flag} width={24} height={24}></Image>
          <Image src={ContactlessIcon} width={20} height={20}></Image>
        </div>
      </div>
    </Card>
  )
}
