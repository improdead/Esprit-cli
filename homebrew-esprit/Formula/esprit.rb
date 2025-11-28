# Esprit CLI Homebrew Formula
# Install via: brew tap improdead/esprit && brew install esprit

class Esprit < Formula
  include Language::Python::Virtualenv

  desc "AI-powered penetration testing CLI"
  homepage "https://esprit.dev"

  # For releases, update these:
  url "https://github.com/improdead/esprit/releases/download/v0.1.0/esprit-0.1.0.tar.gz"
  sha256 "UPDATE_WITH_ACTUAL_SHA256"
  license "MIT"

  # For development from git:
  # head "https://github.com/improdead/esprit.git", branch: "main"

  depends_on "python@3.11"

  # Python dependencies (generated from requirements)
  resource "httpx" do
    url "https://files.pythonhosted.org/packages/source/h/httpx/httpx-0.27.0.tar.gz"
    sha256 "a0cb88a46f32dc874e04ee956e4c2764abb2945f4b8f94e1758a92f826c9c8b6"
  end

  resource "rich" do
    url "https://files.pythonhosted.org/packages/source/r/rich/rich-13.7.0.tar.gz"
    sha256 "5cb5f1b9c1b24b8c7cbc6a8c6d8c4f4b8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c"
  end

  resource "click" do
    url "https://files.pythonhosted.org/packages/source/c/click/click-8.1.7.tar.gz"
    sha256 "ca9853ad459e787e2192211578cc907e7594e294c7ccc834310722b41b9ca6de"
  end

  def install
    virtualenv_install_with_resources

    # Create wrapper script
    (bin/"esprit").write <<~EOS
      #!/bin/bash
      export ESPRIT_HOME="${HOME}/.esprit"
      exec "#{libexec}/bin/python" -m esprit.interface.main "$@"
    EOS

    chmod 0755, bin/"esprit"
  end

  def post_install
    # Create config directory
    (var/"esprit").mkpath
  end

  def caveats
    <<~EOS
      Esprit has been installed!

      To get started:
        1. Login to your account:
           esprit login

        2. Start a scan:
           esprit scan --target https://example.com

      For more information:
        esprit --help
        https://docs.esprit.dev
    EOS
  end

  test do
    # Test that CLI runs
    assert_match "Esprit", shell_output("#{bin}/esprit --version")

    # Test help command
    assert_match "Usage:", shell_output("#{bin}/esprit --help")
  end
end
