import os
import struct
import re
import time
from steam import SteamClient
from csgo import CSGOClient
from csgo.enums import ECsgoGCMsg

client = SteamClient()
cs = CSGOClient(client)

@client.on('logged_on')
def start_csgo():
    print('launching csgo...')
    cs.launch()

@cs.on('ready')
def gc_ready():
    print('launched csgo')
    with open('inspect_links.txt', 'r') as f:
        lines = f.readlines()
    start_time = time.time()
    for line in lines:
        items = re.split('([SM])(\d+)A(\d+)D(\d+)$', line)
        paintwear = None
        while paintwear is None:
            paintwear = send(int(items[2]), int(items[3]), int(items[4]), 0)
        print(paintwear)
        # time.sleep(.5) - 107.601
        # time.sleep(.5) - 100.736
        time.sleep(.5)
        # time.sleep(.2) - 146.518
        # time.sleep(1) - 137.213
        # time.sleep(.7) - 119.638
    end_time = time.time()
    print('total time: ' + str(end_time - start_time))
    pass

def send(s, a, d, m):
    cs.send(ECsgoGCMsg.EMsgGCCStrike15_v2_Client2GCEconPreviewDataBlockRequest, {
        'param_s': s,
        'param_a': a,
        'param_d': d,
        'param_m': m,
        })

    resp = cs.wait_event(ECsgoGCMsg.EMsgGCCStrike15_v2_Client2GCEconPreviewDataBlockResponse, timeout = 2)

    try:
        return struct.unpack('f', struct.pack('i', resp[0].iteminfo.paintwear))
    except:
        return None

client.cli_login()

# import time
# print('sleeping 10, please work.....')
# time.sleep(10)
# 
# cs.send(ECsgoGCMsg.EMsgGCCStrike15_v2_Client2GCEconPreviewDataBlockRequest, {
#     'param_s': 76561198261551396,
#     'param_a': 9990046271,
#     'param_d': 5638728974116512353,
#     # 'param_m': 0,
#     })
# 
# resp = cs.wait_event(ECsgoGCMsg.EMsgGCCStrike15_v2_Client2GCEconPreviewDataBlockResponse, timeout = 2)
# 
# print(struct.unpack('f', struct.pack('i', resp[0].iteminfo.paintwear)))


client.run_forever()
#client.logout()
