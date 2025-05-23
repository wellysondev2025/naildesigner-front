import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-pink-600 text-white py-6 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Nail Designer. Todos os direitos reservados.</p>
        <nav className="mt-4 md:mt-0 space-x-6 flex">
          <a href="https://instagram.com/seu_perfil" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-300">
            <FaInstagram size={20} />
          </a>
          <a href="https://facebook.com/seu_perfil" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-pink-300">
            <FaFacebookF size={20} />
          </a>
          <a href="https://wa.me/seunumerodetelefone" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-pink-300">
            <FaWhatsapp size={20} />
          </a>
        </nav>
      </div>
    </footer>
  );
}
