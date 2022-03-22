import Image from 'next/image'
import Card from 'react-animated-3d-card'
import MinimalOrb from '../public/minimal-orb.svg'

export default function Passport() {
  return (
    <Card
      style={{
        width: '300px',
        height: '450px',
        cursor: 'pointer',
      }}
      onClick={() => console.log('Card clicked')}
    >
      <div className="bg-gradient-to-r from-n3blue to-n3green absolute top-0 left-0 right-0 bottom-0">
        <div>
          <img
            style={{
              position: 'absolute',
              left: '25px',
              top: '25px',
              height: '50px',
            }}
            src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
            className="card-item__chip"
            alt="credit card chip"
          ></img>
          <div
            style={{
              position: 'absolute',
              right: '25px',
              top: '25px',
            }}
          >
            <Image
              style={{
                position: 'absolute',
                right: '25px',
                top: '25px',
                height: '50px',
              }}
              width={50}
              height={50}
              src={MinimalOrb}
              className="card-item__chip"
              alt="credit card chip"
            />
          </div>
        </div>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '30px',
              color: 'white',
            }}
          >
            <label>Nation3 Passport</label>
          </div>
        </div>
        <div>
          <label
            style={{
              color: 'white',
              position: 'absolute',
              bottom: '60px',
              left: '25px',
              opacity: 0.5,
            }}
          >
            Passport holder
          </label>
          <label
            style={{
              color: 'white',
              position: 'absolute',
              bottom: '60px',
              right: '25px',
              opacity: 0.5,
            }}
          >
            Expires
          </label>
        </div>

        <div>
          <label
            style={{
              color: 'white',
              position: 'absolute',
              bottom: '25px',
              left: '25px',
              opacity: 1,
              fontSize: '25px',
            }}
          >
            Paul Doe
          </label>
          <label
            style={{
              color: 'white',
              position: 'absolute',
              bottom: '25px',
              right: '25px',
              opacity: 1,
              fontSize: '25px',
            }}
          >
            10/22
          </label>
        </div>
      </div>
    </Card>
  )
}
