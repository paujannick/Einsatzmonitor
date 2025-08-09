#!/usr/bin/env python3
"""Update the repository and Python dependencies."""
import subprocess
import sys
from typing import List


def run(cmd: List[str]) -> None:
    """Run a subprocess command and ensure it succeeds."""
    subprocess.run(cmd, check=True)


def main() -> None:
    """Pull latest code and install Python requirements."""
    run(["git", "pull"])
    run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    print("Update completed.")


if __name__ == "__main__":
    main()
