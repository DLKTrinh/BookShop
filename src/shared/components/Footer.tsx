const Footer: React.FC = () => {
  return (
    <footer className="h-15 flex items-center justify-center border-t border-border bg-card text-muted-foreground text-sm">
      <p>
        © {new Date().getFullYear()} BookManager. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;