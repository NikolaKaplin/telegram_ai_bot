{ pkgs, ... }: {
  channel = "stable-23.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    
    pkgs.bun
    pkgs.zip
    pkgs.openssl.dev
  ];

  env = {};

  idx = {
    extensions = [
      "esbenp.prettier-vscode"
    ];
    
    workspace = {
      onCreate = {
        # Example: install JS dependencies from NPM
        npm-install = "bun i";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [ ".idx/dev.nix" "README.md" ];
      };
      
      onStart = {
        # Example: start a background task to watch and re-build backend code
        # watch-backend = "npm run watch-backend";
      };
    };
  };
}
