import "./Footer.css";

export default function Footer() {
  return (
    <footer id="contatti" className="section footer">
      <div className="container footer__grid">
        <div>
          <h4 className="footer__title">Contatti</h4>
          <ul className="footer__list">
            <li>Via xxxxxxxx (SS)</li>
            <li>Mobile: +xxxxxxx</li>
            <li>Email: xxxxx@gmail.com</li>
          </ul>
        </div>
        <div>
          <h4 className="footer__title">Canali Social</h4>
          <p className="footer__text">
            Instagram • YouTube • Facebook . TikTok
          </p>
        </div>
        <div>
          <h4 className="footer__title">Newsletter</h4>
          <p className="footer__text">
            Tieniti sempre aggiornato. Iscriviti alla nostra newsletter.
          </p>
          <form className="footer__form">
            <input type="email" placeholder="Email" className="footer__input" />
            <button className="footer__btn">Iscriviti</button>
          </form>
        </div>
      </div>
      <div className="container footer__copy">
        ©{new Date().getFullYear()} Gioele Friggia
      </div>
    </footer>
  );
}
