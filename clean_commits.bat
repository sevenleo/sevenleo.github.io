@echo off
echo ---------------------------------------------------
echo Iniciando o processo de reiniciar o historico do Git
echo ATENCAO: Esse processo ira apagar todo o historico de commits.
echo ---------------------------------------------------
pause

echo Criando branch orfã "temp_branch"...
git checkout --orphan temp_branch
if errorlevel 1 goto erro

echo Adicionando todos os arquivos...
git add -A
if errorlevel 1 goto erro

echo Criando novo commit...
git commit -m "sevenleo"
if errorlevel 1 goto erro

echo Deletando branch master antiga...
git branch -D master
if errorlevel 1 goto erro

echo Renomeando branch atual para master...
git branch -m master
if errorlevel 1 goto erro

echo Forcando push para o repositorio remoto...
git push --force origin master
if errorlevel 1 goto erro

echo ---------------------------------------------------
echo Processo concluido com sucesso!
echo ---------------------------------------------------
goto fim

:erro
echo Ocorreu um erro durante o processo.
:fim
pause
