#!/usr/bin/python
# -*- coding: UTF-8 -*-

import MySQLdb

db = MySQLdb.connect("localhost","root","qtrh2130","test1")

cursor = db.cursor()

sql = "select * from test1_t";

try:
    cursor.execute(sql)
    datas = cursor.fetchall()
    for data in datas:
        sid = data[0]
        name = data[1]
        print 'sid = %s  name = %s' % (sid,name)
except:
    print 'error in search ...'

db.close()
