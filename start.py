#!/usr/bin/env python3
"""Start the Einsatzmonitor server."""
import subprocess
import sys


def main() -> None:
    """Launch the Flask server."""
    subprocess.run([sys.executable, "server.py"], check=True)


if __name__ == "__main__":
    main()
