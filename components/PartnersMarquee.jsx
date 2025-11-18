import './PartnersMarquee.css';

export default function PartnersMarquee(){
  const logos=[
    'https://dummyimage.com/160x60/ffffff/000000.png&text=Partner+1',
    'https://dummyimage.com/160x60/ffffff/000000.png&text=Partner+2',
    'https://dummyimage.com/160x60/ffffff/000000.png&text=Partner+3',
    'https://dummyimage.com/160x60/ffffff/000000.png&text=Partner+4',
  ];
  return (
    <section className="section">
      <div className="container">
        <h2 className="title">Ringraziamo i nostri Partners</h2>
      </div>
      <div className="marqueeWrap">
        <div className="marquee" aria-hidden>
          {[...logos, ...logos, ...logos].map((src,i)=> (
            <img key={i} src={src} alt="Partner" className="marquee__img" />
          ))}
        </div>
      </div>
    </section>
  )
}
