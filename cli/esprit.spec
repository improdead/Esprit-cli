# -*- mode: python ; coding: utf-8 -*-
"""
PyInstaller spec file for building Esprit CLI as a standalone binary.

Usage:
    pyinstaller esprit.spec

This creates a single executable that includes all dependencies,
no Python installation required on the target machine.
"""

import sys
from pathlib import Path

# Get the project root
project_root = Path('.').resolve()

# Analysis
a = Analysis(
    ['esprit/interface/main.py'],
    pathex=[str(project_root)],
    binaries=[],
    datas=[
        # Include Jinja templates
        ('esprit/agents/EspritAgent/system_prompt.jinja', 'esprit/agents/EspritAgent'),
        # Include tool schemas
        ('esprit/tools/*/schema.xml', 'esprit/tools'),
        # Include prompts directory
        ('esprit/prompts', 'esprit/prompts'),
    ],
    hiddenimports=[
        # Core modules
        'esprit',
        'esprit.interface',
        'esprit.interface.main',
        'esprit.auth',
        'esprit.auth.client',
        'esprit.auth.credentials',
        'esprit.auth.commands',
        'esprit.runtime',
        'esprit.runtime.remote_runtime',
        # Rich console
        'rich',
        'rich.console',
        'rich.panel',
        'rich.table',
        # HTTP client
        'httpx',
        'httpx._transports',
        'httpx._transports.default',
        # Click CLI
        'click',
        # Async
        'anyio',
        'anyio._backends._asyncio',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        # Exclude development tools
        'pytest',
        'black',
        'flake8',
        'mypy',
        # Exclude test modules
        'test',
        'tests',
        '_test',
        # Exclude documentation
        'sphinx',
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=None,
    noarchive=False,
)

# Create PYZ archive
pyz = PYZ(a.pure, a.zipped_data, cipher=None)

# Create single executable
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='esprit',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,  # Add icon path if you have one: 'assets/icon.icns'
)
