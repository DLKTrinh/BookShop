const Footer: React.FC = () => {
  return (
    <footer className="h-15 flex items-center justify-center border-t border-gray-700 bg-gray-800 text-gray-400 text-sm">
      <p>
        © {new Date().getFullYear()} BookManager. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
