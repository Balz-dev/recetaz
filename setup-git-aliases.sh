#!/bin/bash

# Script para configurar alias de Git

echo "Configurando alias de Git..."

# Visualización
git config --global alias.tree "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --all"
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)' --abbrev-commit"

# Shortcuts
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

# Workflow específico
git config --global alias.landing "checkout dev-landing"
git config --global alias.app "checkout dev-app"
git config --global alias.dev "checkout dev"
git config --global alias.prod "checkout main"

# Limpieza
git config --global alias.cleanup "!git branch --merged dev | grep -v 'main\\|dev\\|*' | xargs -r git branch -d"

echo ""
echo "✅ Alias configurados exitosamente!"
echo ""
echo "Alias disponibles:"
git config --global --get-regexp alias
