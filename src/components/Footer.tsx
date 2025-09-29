type FooterProps = {
  dict: { [key: string]: string };
};

export default function Footer({ dict }: FooterProps) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <p>&copy; {currentYear} Tempt-Mail. {dict.footerRights || 'All rights reserved.'}</p>
        <div className="footer-links">
          <a href="#">{dict.footerPrivacy || 'Privacy Policy'}</a>
          <a href="#">{dict.footerTerms || 'Terms of Service'}</a>
        </div>
      </div>
    </footer>
  );
}
