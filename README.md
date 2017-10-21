# mdBurst
Stock et lit documents md sous forme de graph

## instalation
‘‘’
virtualenv venv
pip install -r requirement.txt
‘‘’

## launch
‘‘’
watchmedo shell-command --patterns="*.py;*.html;*.css;*.js" --recursive --command='echo "${watch_src_path}" && kill -HUP `cat gunicorn.pid`' . &
gunicorn app:app --pid=gunicorn.pid --threads 2
‘‘’
