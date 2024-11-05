{
    chmod +r /home/site/wwwroot/output.tar.gz && echo "Permissions set" && \
    tar -xzf /home/site/wwwroot/output.tar.gz -C --exclude='antenv/lib/python3.12/site-packages/pytz' /home/site/wwwroot && echo "Extraction complete" && \
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && echo "get-pip.py downloaded" && \
    python3 get-pip.py && echo "pip installed" && \
    export PATH=$PATH:/home/.local/bin && echo "PATH updated" && \
    source /home/site/wwwroot/antenv/bin/activate && echo "Virtual environment activated" && \
    pip install -r /home/site/wwwroot/requirements.txt && echo "Requirements installed" && \
    python3 /home/site/wwwroot/myproject/manage.py collectstatic && echo "Static files collected" && \
   gunicorn --bind=0.0.0.0:8000 --timeout 120 --workers=4 --chdir /home/site/wwwroot/myproject myproject.wsgi:application > /home/site/wwwroot/gunicorn.log 2>&1
} > /home/site/wwwroot/startup.log 2>&1 &