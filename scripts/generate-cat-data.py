#!/usr/bin/python

import json

names = [ "Bella", "Tigger", "Chloe", "Molly", "Oliver", "Tucker", "Bandit", "Boots", "Jake", "Pumpkin", "Shadow", "Kitty", "Smokey", "Angel", "Gizmo", "Jack", "Jasper", "Lily", "Oreo", "Tiger", "Charlie", "Lucy", "Simba", "Baby", "Luna", "Midnight", "Peanut", "Harley", "Toby", "Oscar", "Princess", "Zoe", "Sammy", "Sassy", "Snickers", "Socks", "Cali", "Fiona", "Phoebe", "Sadie", "Sox", "Casper", "Daisy", "Dexter", "Gracie", "Lilly", "Lola", "Marley", "Minnie", "Precious", "Romeo", "Blackie", "Felix", "Frankie", "Loki", "Nala", "Rocky", "Sophie", "Coco", "Max", "Mittens", "Bailey", "Buddy", "Kiki", "Milo", "Missy", "Patches", "Sasha", "Callie", "Garfield", "Lucky", "Misty", "Pepper", "Sebastian", "George", "Maggie", "Simon", "Muffin", "Murphy", "Scooter", "Batman", "Belle", "Boo", "Chester", "Fluffy", "Ginger", "Jasmine", "Mimi", "Rusty", "Sweetie", "Cupcake", "Dusty", "Izzy", "Panda", "Sugar", "Zeus", "Ziggy", "Zoey", "Blue", "Cleo", ]

urls = ['http://i.imgur.com/K6QiSEs.jpg', 'http://i.imgur.com/GRLcAqQ.jpg', 'http://imgur.com/a/s4h6Q', 'http://i.imgur.com/tFhG1J6.jpg', 'http://i.imgur.com/jytiWdF.jpg', 'http://i.imgur.com/lRtW1Xa.jpg', 'http://i.imgur.com/pOkxIP6.jpg', 'http://i.imgur.com/jZ15jUM.jpg', 'http://i.imgur.com/mCvlluF.jpg', 'http://i.imgur.com/oRM7dRM.jpg', 'http://i.imgur.com/LxF5AER.jpg', 'http://i.imgur.com/GwouCY8.jpg', 'http://i.imgur.com/rDk1utf.jpg', 'http://i.imgur.com/DxXBiez.jpg', 'http://i.imgur.com/SD0LvFo.png', 'http://i.imgur.com/JBdZARN.jpg', 'http://i.imgur.com/UzCMJSD.jpg', 'http://i.imgur.com/56dZqrw.jpg', 'http://i.imgur.com/cZrlKsZ.jpg', 'http://i.imgur.com/c2hOInQ.jpg', 'http://i.imgur.com/889A7px.jpg', 'http://i.imgur.com/Erv3vi3.jpg', 'http://i.imgur.com/EKr1TTv.jpg', 'http://i.imgur.com/inKFuRO.jpg', 'http://i.imgur.com/JdMmCMn.jpg', 'http://i.imgur.com/Wjjrw9H.jpg', 'http://i.imgur.com/4qJycbO.jpg', 'http://i.imgur.com/NEC2lKN.jpg', 'http://i.imgur.com/jVwxMIX.jpg', 'http://i.imgur.com/9sUdYkK.jpg', 'http://i.imgur.com/syAUtkX.jpg', 'http://i.imgur.com/WFdrCfB.jpg', 'http://i.imgur.com/l4tudG1.jpg', 'http://i.imgur.com/ycCDN9H.jpg', 'http://imgur.com/a/Y92Hj', 'http://i.imgur.com/EsR0oBx.jpg', 'http://i.imgur.com/9vLn8Fc.jpg', 'http://i.imgur.com/lc2JUd5.jpg', 'http://i.imgur.com/xKH5KD6.jpg', 'http://i.imgur.com/rGZaeG8.jpg', 'http://i.imgur.com/o0HP9dP.jpg', 'http://i.imgur.com/r7FhdB8.jpg', 'http://imgur.com/a/DZf9J', 'http://i.imgur.com/gEWjvzj.jpg', 'http://i.imgur.com/MxVRg4t.jpg', 'http://i.imgur.com/VyXPwFP.jpg', 'http://i.imgur.com/SkSy4Vt.jpg', 'http://i.imgur.com/DRbXv.jpg', 'http://i.imgur.com/VQpXKCF.jpg', 'http://i.imgur.com/qtLF1mX.jpg', 'http://i.imgur.com/2O7wn7D.png', 'http://i.imgur.com/YbMBjff.jpg', 'http://i.imgur.com/i2FgGFE.jpg', 'http://i.imgur.com/lHHe21l.jpg', 'http://i.imgur.com/f08yD4Z.jpg', 'http://i.imgur.com/lfYtUS6.jpg', 'http://i.imgur.com/rmQmj7g.jpg', 'https://www.flickr.com/photos/parismadrid/6850934334/', 'http://i.imgur.com/Nt1xI9O.jpg', 'http://i.imgur.com/6Qbdjfh.jpg', 'http://i.imgur.com/kVZvvLv.jpg', 'http://i.imgur.com/2eilDaX.jpg', 'http://i.imgur.com/pM2okgK.jpg', 'http://i.imgur.com/C94l1iu.jpg', 'http://i.imgur.com/twSoQyx.jpg', 'http://i.imgur.com/9aaejUg.jpg', 'http://i.imgur.com/pxXFASK.jpg', 'http://i.imgur.com/t6Uo1uJ.jpg', 'http://i.imgur.com/Ro50stH.jpg', 'http://i.imgur.com/lW6cJJb.jpg', 'http://i.imgur.com/8dGusNg.jpg', 'http://imgur.com/a/5lNXi', 'http://i.imgur.com/FOGUfi1.jpg', 'http://i.imgur.com/839iYsR.jpg', 'http://i.imgur.com/lFPPnBA.jpg', 'http://m.imgur.com/gallery/AeDguiH', 'http://imgur.com/r/cats/8fWDFGV', 'http://i.imgur.com/OZ8qd2Q.jpg', 'http://i.imgur.com/FEFn2tj.jpg', 'http://i.imgur.com/ZyYYtUV.jpg', 'http://i.imgur.com/TcL2ch3.jpg', 'http://i.imgur.com/Fhv2xmQ.jpg', 'http://i.imgur.com/MEWRjap.jpg', 'http://i.imgur.com/OKvO3Zn.jpg', 'http://i.imgur.com/gM83061.jpg', 'http://i.imgur.com/xI5sF2U.jpg', 'http://i.imgur.com/licESx2.jpg', 'http://imgur.com/gallery/yfiwbhf/new', 'http://imgur.com/gallery/X8vzQN6/new', 'http://i.imgur.com/0uX1iM4.jpg', 'http://i.imgur.com/9fPtp0j.jpg', 'http://i.imgur.com/wEk2gvD.gif', 'http://i.imgur.com/E1DCmBk.jpg', 'http://i.imgur.com/zSGX3HM.jpg', 'http://i.imgur.com/w1XzBKJ.jpg', 'http://i.imgur.com/MPFaf8E.jpg', 'http://i.imgur.com/AntinIr.jpg', 'http://i.imgur.com/SNA9mG7.jpg', 'http://i.imgur.com/0FsuPQB.jpg', 'http://i.imgur.com/9vK3ETw.jpg']

import random

breeds = ["Calico", "Bobtail", "Manx", "Ragdoll", "Siamese"]

cats = []

for i in range(0, 100):
	cats.append(dict({
		"name" : names[i],
		"breed" : random.choice(breeds),
		"imageUrl" : urls[i]
	}))

print(json.dumps(cats))


