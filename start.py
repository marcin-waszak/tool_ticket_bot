import os
import sys
import time
import random
import smtplib
import subprocess
import shutil
import glob

from datetime import datetime
from subprocess import call
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from_address = 'konto_bota@gmail'
from_password = 'passwd'
to_address = 'madras95@gmail.com'

def print_log(log = '', end = '\n'):
	log_prefix = '['
	log_prefix += datetime.now().strftime('%Y-%m-%d %H:%M:%S')
	log_prefix += '] '
	log_prefix += log
	log_prefix += end
	print(log_prefix, end = '')
	sys.stdout.flush()
	
def create_folder(directory):
    try:
        if not os.path.exists(directory):
            os.makedirs(directory)
    except OSError:
        print ('Error: Creating directory. ' +  directory)
		
def make_dump(prefix = 'dump'):
	current_time = datetime.now().strftime(prefix + '_%Y%m%d%H%M%S')
	create_folder(current_time)

	for file in glob.glob(r'rendered_*'):
		shutil.copy(file, current_time)
	
	print_log('Dumped data: ' + current_time)

def mail(from_address, to_address, password, subject = None, message = None):
	mailserver = smtplib.SMTP_SSL('smtp.gmail.com', 465)
	mailserver.ehlo()
	mailserver.login(from_address, password)

	if subject is not None and message is not None:
		msg = MIMEMultipart()
		msg['From'] = from_address
		msg['To'] = to_address
		msg['Subject'] = subject
		msg.attach(MIMEText(message))
		mailserver.sendmail(from_address, to_address, msg.as_string())
		print_log('Mail sent successfully!')
		
	else:
		print_log('Logged successfully!')
		
	mailserver.quit()

def main():
	print('Marcin Waszak (C)2018\n')
	print_log('Starting ToolBot... Sending sanity-check mail...')

	title = '[ToolBot] Bot has been startd!'
	message = 'As in title. Working...'
	mail(from_address, to_address, from_password, title, message)
	
	FNULL = open(os.devnull, 'w')
	
	while True:
		print_log('Checking...', end = ' ');
		call(["phantomjs", "script.js", "https://www.ticketmaster.pl/event/impact-festival-2019-tool-tickets/9517?brand=pl_livenation&camefrom=cfc_cob_livenation"], stdout=FNULL, stderr=subprocess.STDOUT)

		with open('rendered_js.html', 'r') as finaljs:
			data=finaljs.read()
		
		if(data.find('Weryfikacja bot') != -1):
			print('Bot has been blocked! Sending email. Pausing for 30 minutes...')
			title = '[ToolBot] Bot has been blocked!'
			message = 'As in title. Pausing for 30 minutes!'
			mail(from_address, to_address, from_password, title, message)
			make_dump('dump_bot')
			time.sleep(30 * 60)
			continue
		
		if(data.find('map__wrapper') != -1):
			if(data.find('"block is-ga"') == -1):
				print('Found GA ticket!\nSending e-mail...');
				title = '[ToolBot] Found GA Tool ticket !!'
				message = 'As in title. Feel free to buy your ticket!'
				mail(from_address, to_address, from_password, title, message)
				make_dump('dump_found')
			else:
				print('Still no tickets...');

		time.sleep(150 + random.randint(-30, 30))

if __name__ == "__main__":
    main()