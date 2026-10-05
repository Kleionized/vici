// Build-time library: icons, grayscale scene builders, card palettes.
globalThis.GRAY = {g1:'#B4B1AB',g2:'#C0BFB8',g3:'#C5C4BD',g4:'#CFCEC7',g5:'#D6D5CE',g6:'#DEDDD6',g7:'#E4E3DE',paper:'#EFEEE8',focal:'#131313',focalD:'#3A3934',chip:'#131313',chipMark:'#F4F3F0',amber:'#E9D2A4',blue:'#C9D6E4',ground:'rgba(0,0,0,0.13)'};

globalThis.PALS = {
 night:{dark:true,sun:false,bg:'linear-gradient(180deg, #0B0C0F 0%, #12151B 60%, #1A2027 100%)',band:'#171B22',glow:'rgba(226,186,120,0.20)',map:{g1:'#55677C',g2:'#4A5A6C',g3:'#394656',g4:'#33404E',g5:'#2C3844',g6:'#26303C',g7:'#222B36',paper:'#DCE3EA',focal:'#DCE3EA',focalD:'#8FA0B2',chip:'#E9D2A4',chipMark:'#131313',amber:'#E9D2A4',blue:'#9FB6C8',ground:'rgba(220,227,234,0.12)'}},
 evening:{dark:true,sun:false,bg:'linear-gradient(180deg, #17130E 0%, #241D13 55%, #33281A 100%)',band:'#1F1810',glow:'rgba(233,194,136,0.26)',map:{g1:'#7A6344',g2:'#6C583C',g3:'#5C4B32',g4:'#4E402B',g5:'#423624',g6:'#372D1E',g7:'#2E2619',paper:'#F0E2C8',focal:'#F0E2C8',focalD:'#BFA87E',chip:'#E9C288',chipMark:'#131313',amber:'#E9C288',blue:'#B9C2C8',ground:'rgba(240,226,200,0.12)'}},
 dusk:{dark:true,sun:false,bg:'linear-gradient(180deg, #232030 0%, #383349 55%, #55495A 100%)',band:'#2C283A',glow:'rgba(226,186,120,0.16)',map:{g1:'#8A7F9E',g2:'#7A7090',g3:'#685F80',g4:'#585070',g5:'#4B4462',g6:'#403A54',g7:'#363048',paper:'#E9E4EE',focal:'#E9E4EE',focalD:'#A99FBC',chip:'#E9C288',chipMark:'#131313',amber:'#E9C288',blue:'#A9B8CC',ground:'rgba(233,228,238,0.12)'}},
 dawn:{dark:true,sun:true,bg:'linear-gradient(180deg, #1F2835 0%, #39485A 52%, #7C8496 100%)',band:'#2B3644',glow:'rgba(233,194,136,0.30)',map:{g1:'#7E92A8',g2:'#70849A',g3:'#617488',g4:'#536376',g5:'#475566',g6:'#3C4858',g7:'#333E4C',paper:'#E6EBF0',focal:'#E6EBF0',focalD:'#A9BACB',chip:'#E9C288',chipMark:'#131313',amber:'#E9C288',blue:'#AFC2D4',ground:'rgba(230,235,240,0.14)'}},
 day:{dark:false,sun:true,bg:'linear-gradient(180deg, #E3EBF2 0%, #EDECE5 100%)',band:'#DEDCD2',glow:'rgba(243,227,196,0.60)',map:{g1:'#AEACA4',g2:'#BAB8B0',g3:'#C2C0B8',g4:'#CCCAC2',g5:'#D4D2CA',g6:'#DCDAD2',g7:'#E2E0D8',paper:'#F7F6F0',focal:'#131313',focalD:'#3A3934',chip:'#E2BA78',chipMark:'#131313',amber:'#E2BA78',blue:'#B9CBDA',ground:'rgba(0,0,0,0.10)'}}
};

// ---------- icons: ICON[key] = c => svg paths (20x20 grid) ----------
globalThis.ICON = {
bed:c=>`<path d="M3 15.5V6" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path><path d="M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"></path><circle cx="5.6" cy="8.9" r="1.5" fill="${c}"></circle>`,
bunk:c=>`<rect x="4" y="3" width="12" height="14" rx="1.8" fill="none" stroke="${c}" stroke-width="1.6"></rect><path d="M10 3v14" stroke="${c}" stroke-width="1.6"></path><path d="M6.8 7.5h0M13.2 7.5h0" stroke="${c}" stroke-width="1.8" stroke-linecap="round"></path><path d="M6.8 10.5v2M13.2 10.5v2" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
couch:c=>`<path d="M4 9V7.5A2.5 2.5 0 0 1 6.5 5h7A2.5 2.5 0 0 1 16 7.5V9" fill="none" stroke="${c}" stroke-width="1.6"></path><path d="M3.5 9a1.8 1.8 0 0 1 1.8 1.8V12h9.4v-1.2A1.8 1.8 0 0 1 16.5 9a1.5 1.5 0 0 1 1.5 1.5V14a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14v-3.5A1.5 1.5 0 0 1 3.5 9Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"></path>`,
alarm:c=>`<circle cx="10" cy="11" r="6" fill="none" stroke="${c}" stroke-width="1.6"></circle><path d="M10 8.2V11l2 1.4" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.5 4.5L3 6M15.5 4.5L17 6" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
clock:c=>`<circle cx="10" cy="10" r="7" fill="none" stroke="${c}" stroke-width="1.6"></circle><path d="M10 6.2V10l2.6 1.8" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>`,
timer:c=>`<circle cx="10" cy="11.2" r="6.2" fill="none" stroke="${c}" stroke-width="1.6"></circle><path d="M10 8.4v2.8l1.9 1.3" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8.2 2.6h3.6M10 2.6v2.4" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
moon:c=>`<path d="M15.7 12.1A6.6 6.6 0 1 1 8.2 4.2a5.3 5.3 0 0 0 7.5 7.9Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"></path>`,
sun:c=>`<circle cx="10" cy="10" r="3.4" fill="none" stroke="${c}" stroke-width="1.6"></circle><path d="M10 2.6v2M10 15.4v2M2.6 10h2M15.4 10h2M4.6 4.6l1.4 1.4M14 14l1.4 1.4M15.4 4.6L14 6M6 14l-1.4 1.4" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
rain:c=>`<path d="M5.8 12.5a3.3 3.3 0 1 1 .6-6.6A4.3 4.3 0 0 1 14.8 7a2.9 2.9 0 0 1-.6 5.5Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"></path><path d="M7 14.6l-.9 2.2M10.5 14.6l-.9 2.2M14 14.6l-.9 2.2" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
cloud:c=>`<path d="M5.6 14.5a3.6 3.6 0 1 1 .7-7.1A4.6 4.6 0 0 1 15.3 8.6a3 3 0 0 1-.7 5.9Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"></path>`,
sunrise:c=>`<path d="M3 15.2h14" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path><path d="M6.2 15.2a3.8 3.8 0 0 1 7.6 0" fill="none" stroke="${c}" stroke-width="1.6"></path><path d="M10 4.4v2.4M4.8 7.6l1.6 1.6M15.2 7.6l-1.6 1.6" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
sparkle:c=>`<path d="M10 3.4l1.7 4.6 4.6 1.7-4.6 1.7L10 16l-1.7-4.6L3.7 9.7l4.6-1.7Z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"></path>`,
flame:c=>`<path d="M10 3c1.1 2.7 3.9 4 3.9 7.1A4.2 4.2 0 0 1 10 14.4a4.2 4.2 0 0 1-3.9-4.3C6.1 7 8.9 5.7 10 3Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"></path><path d="M8.6 16.8h2.8" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
phone:c=>`<rect x="6.5" y="3" width="7" height="14" rx="1.8" fill="none" stroke="${c}" stroke-width="1.6"></rect><path d="M9 14.6h2" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
apps:c=>`<rect x="3.5" y="3.5" width="5.4" height="5.4" rx="1.4" fill="none" stroke="${c}" stroke-width="1.5"></rect><rect x="11.1" y="3.5" width="5.4" height="5.4" rx="1.4" fill="none" stroke="${c}" stroke-width="1.5"></rect><rect x="3.5" y="11.1" width="5.4" height="5.4" rx="1.4" fill="none" stroke="${c}" stroke-width="1.5"></rect><rect x="11.1" y="11.1" width="5.4" height="5.4" rx="1.4" fill="none" stroke="${c}" stroke-width="1.5"></rect>`,
search:c=>`<circle cx="8.6" cy="8.6" r="5" fill="none" stroke="${c}" stroke-width="1.6"></circle><path d="M12.4 12.4L17 17" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
lock:c=>`<rect x="5" y="9" width="10" height="8" rx="2" fill="none" stroke="${c}" stroke-width="1.6"></rect><path d="M7 9V6.8a3 3 0 0 1 6 0V9" fill="none" stroke="${c}" stroke-width="1.6"></path><path d="M10 12.2v1.6" stroke="${c}" stroke-width="1.7" stroke-linecap="round"></path>`,
code:c=>`<path d="M7 6.5L3.5 10 7 13.5M13 6.5l3.5 3.5L13 13.5" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>`,
bulb:c=>`<path d="M10 3a5 5 0 0 1 2.9 9.1c-.6.5-.9 1-.9 1.9H8c0-.9-.3-1.4-.9-1.9A5 5 0 0 1 10 3Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"></path><path d="M8.4 16.6h3.2" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
home:c=>`<path d="M3.5 9.7L10 3.6l6.5 6.1v6.8h-4.6v-4.2H8.1v4.2H3.5Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"></path>`,
door:c=>`<rect x="6" y="3" width="8" height="14" rx="1" fill="none" stroke="${c}" stroke-width="1.6"></rect><circle cx="12" cy="10.2" r="0.9" fill="${c}"></circle><path d="M4 17h12" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
building:c=>`<rect x="4.5" y="4.5" width="11" height="12.5" rx="1" fill="none" stroke="${c}" stroke-width="1.6"></rect><path d="M7.5 7.8h1.6M10.9 7.8h1.6M7.5 10.8h1.6M10.9 10.8h1.6M9 17v-2.8h2V17" stroke="${c}" stroke-width="1.5" stroke-linecap="round"></path>`,
broom:c=>`<path d="M14.5 3L9.6 9.8" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path><path d="M9.9 9.4c1.8.9 2.9 2.2 3.3 4.3l-5.7 3c-1.5-1.4-2-3-1.7-5.1Z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"></path><path d="M8.4 12.4l2.5 1.5" stroke="${c}" stroke-width="1.3" stroke-linecap="round"></path>`,
trash:c=>`<path d="M4.5 6h11M8 6V4.6h4V6M6.2 6l.7 10.4h6.2L13.8 6" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8.7 9v4.4M11.3 9v4.4" stroke="${c}" stroke-width="1.4" stroke-linecap="round"></path>`,
bag:c=>`<path d="M6 7.6h8l1 8.9H5Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"></path><path d="M7.8 7.6V6a2.2 2.2 0 0 1 4.4 0v1.6" fill="none" stroke="${c}" stroke-width="1.6"></path>`,
book:c=>`<path d="M10 5.6C8.6 4.2 6.4 3.7 3.6 4v10.8c2.8-.3 5 .2 6.4 1.6 1.4-1.4 3.6-1.9 6.4-1.6V4c-2.8-.3-5 .2-6.4 1.6Z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"></path><path d="M10 5.6v10.8" stroke="${c}" stroke-width="1.5"></path>`,
note:c=>`<rect x="4.5" y="3.5" width="11" height="13" rx="1.5" fill="none" stroke="${c}" stroke-width="1.6"></rect><path d="M7.3 7.4h5.4M7.3 10.2h5.4M7.3 13h3.2" stroke="${c}" stroke-width="1.4" stroke-linecap="round"></path>`,
list:c=>`<path d="M8 5.4h8.5M8 10h8.5M8 14.6h8.5" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path><circle cx="4.4" cy="5.4" r="1" fill="${c}"></circle><circle cx="4.4" cy="10" r="1" fill="${c}"></circle><circle cx="4.4" cy="14.6" r="1" fill="${c}"></circle>`,
calendar:c=>`<rect x="3.5" y="5" width="13" height="11.5" rx="1.6" fill="none" stroke="${c}" stroke-width="1.6"></rect><path d="M3.5 8.6h13M7 3.2v3M13 3.2v3" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path><circle cx="7.6" cy="12.2" r="1.1" fill="${c}"></circle>`,
pin:c=>`<path d="M10 3.2a4.6 4.6 0 0 1 4.6 4.6C14.6 11.1 10 16.8 10 16.8S5.4 11.1 5.4 7.8A4.6 4.6 0 0 1 10 3.2Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"></path><circle cx="10" cy="7.8" r="1.5" fill="${c}"></circle>`,
flag:c=>`<path d="M5.5 17.2V3.4" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path><path d="M5.5 4.4c2-1.1 4-1.1 6 0s4 1.1 5.5.2v6.6c-1.5.9-3.5.9-5.5-.2s-4-1.1-6 0Z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"></path>`,
target:c=>`<circle cx="10" cy="10" r="6.6" fill="none" stroke="${c}" stroke-width="1.5"></circle><circle cx="10" cy="10" r="3.4" fill="none" stroke="${c}" stroke-width="1.5"></circle><circle cx="10" cy="10" r="0.9" fill="${c}"></circle>`,
check:c=>`<circle cx="10" cy="10" r="7" fill="none" stroke="${c}" stroke-width="1.6"></circle><path d="M6.8 10.2l2.2 2.2 4.2-4.8" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>`,
question:c=>`<path d="M7.2 7.4A2.9 2.9 0 0 1 13 8c0 1.9-2 2.2-2.6 3.4-.2.4-.3.9-.3 1.4" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path><circle cx="10" cy="16" r="1" fill="${c}"></circle>`,
repeat:c=>`<path d="M4.3 8.4a6 6 0 0 1 10.6-1.7" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path><path d="M15.2 3.4v3.4h-3.4" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.7 11.6a6 6 0 0 1-10.6 1.7" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path><path d="M4.8 16.6v-3.4h3.4" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>`,
undo:c=>`<path d="M5.2 7.6H12a4 4 0 0 1 0 8H8.6" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path><path d="M8 4.6l-3 3 3 3" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>`,
hand:c=>`<path d="M6.4 11.4V6a1.1 1.1 0 0 1 2.2 0v4M8.6 5.4V4.2a1.1 1.1 0 0 1 2.2 0V10m0-4.9a1.1 1.1 0 0 1 2.2 0V11m0-3.3a1.1 1.1 0 0 1 2.2 0v4.7a5.4 5.4 0 0 1-9.3 3.7l-2.5-2.7a1.3 1.3 0 0 1 1.9-1.8l1.5 1.3" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>`,
eye:c=>`<path d="M2.8 10S5.5 5.4 10 5.4 17.2 10 17.2 10 14.5 14.6 10 14.6 2.8 10 2.8 10Z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"></path><circle cx="10" cy="10" r="2.1" fill="none" stroke="${c}" stroke-width="1.5"></circle>`,
chat:c=>`<path d="M16.5 9.6a6.1 5.4 0 0 1-9 4.7L4 15.6l1.1-2.9a5.4 5.4 0 1 1 11.4-3.1Z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"></path><path d="M7.6 9.8h4.8" stroke="${c}" stroke-width="1.4" stroke-linecap="round"></path>`,
call:c=>`<path d="M6.8 3.8L8.6 7l-1.7 1.6a10.8 10.8 0 0 0 4.5 4.5L13 11.4l3.2 1.8-.9 2.9c-.3.8-1.1 1.3-1.9 1.1A13.6 13.6 0 0 1 2.8 6.6c-.2-.8.3-1.6 1.1-1.9Z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"></path>`,
letter:c=>`<rect x="3.5" y="5" width="13" height="10" rx="1.5" fill="none" stroke="${c}" stroke-width="1.6"></rect><path d="M4.2 6l5.8 4.6L15.8 6" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"></path>`,
people:c=>`<circle cx="7" cy="7" r="2.6" fill="none" stroke="${c}" stroke-width="1.5"></circle><path d="M2.8 16a4.2 4.2 0 0 1 8.4 0" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"></path><circle cx="14" cy="7.6" r="2.1" fill="none" stroke="${c}" stroke-width="1.5"></circle><path d="M13 16a3.9 3.9 0 0 1 4.4-3.4" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"></path>`,
heart:c=>`<path d="M10 16.4S3.6 12.6 3.6 8.2A3.5 3.5 0 0 1 10 6.1a3.5 3.5 0 0 1 6.4 2.1c0 4.4-6.4 8.2-6.4 8.2Z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"></path>`,
meal:c=>`<circle cx="10" cy="11" r="5.6" fill="none" stroke="${c}" stroke-width="1.5"></circle><circle cx="10" cy="11" r="2.6" fill="none" stroke="${c}" stroke-width="1.5"></circle><path d="M7.6 3.2c0-1 .9-1 .9-2M11.5 3.2c0-1 .9-1 .9-2" stroke="${c}" stroke-width="1.3" stroke-linecap="round" transform="translate(0,2.4)"></path>`,
coffee:c=>`<path d="M5 8h9v4.4a3.6 3.6 0 0 1-3.6 3.6H8.6A3.6 3.6 0 0 1 5 12.4Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"></path><path d="M14 9h.9a2 2 0 0 1 0 4H14" fill="none" stroke="${c}" stroke-width="1.5"></path><path d="M7.7 5.4c0-1 .8-1 .8-2M10.9 5.4c0-1 .8-1 .8-2" stroke="${c}" stroke-width="1.3" stroke-linecap="round"></path>`,
water:c=>`<path d="M6 3.5h8l-1 13H7Z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"></path><path d="M6.6 8.4h6.8" stroke="${c}" stroke-width="1.4" stroke-linecap="round"></path>`,
shower:c=>`<path d="M6.2 7.6a3.8 3.8 0 0 1 7.6 0v.8H6.2Z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"></path><path d="M10 3.8V2.6" stroke="${c}" stroke-width="1.5" stroke-linecap="round"></path><path d="M7 11.2l-.6 1.8M10 11.6l-.6 1.8M13 11.2l-.6 1.8M8.5 15l-.6 1.8M11.5 15l-.6 1.8" stroke="${c}" stroke-width="1.4" stroke-linecap="round"></path>`,
film:c=>`<rect x="3.5" y="5" width="13" height="10" rx="1.5" fill="none" stroke="${c}" stroke-width="1.6"></rect><path d="M6.6 5v10M13.4 5v10M3.5 8h3.1M3.5 12h3.1M13.4 8h3.1M13.4 12h3.1" stroke="${c}" stroke-width="1.3"></path>`,
wallet:c=>`<rect x="3" y="5.5" width="14" height="9.5" rx="2" fill="none" stroke="${c}" stroke-width="1.6"></rect><path d="M13 10.2h4" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path><circle cx="13.6" cy="10.2" r="0.9" fill="${c}"></circle>`,
walk:c=>`<circle cx="10.8" cy="3.8" r="1.6" fill="none" stroke="${c}" stroke-width="1.5"></circle><path d="M10.4 6.6l-1.8 4 2.3 1.9.7 4M8.6 10.6l-2.4 1M10.4 6.6l2.5 1.5 1.6 2.5M8.6 12.5l-2.3 4" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>`,
dumbbell:c=>`<path d="M6.6 6.4v7.2M13.4 6.4v7.2M4 8v4M16 8v4M6.6 10h6.8" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
music:c=>`<path d="M8 15.2V5.2l7-1.6v9.8" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"></path><circle cx="6.2" cy="15.2" r="1.9" fill="none" stroke="${c}" stroke-width="1.5"></circle><circle cx="13.2" cy="13.4" r="1.9" fill="none" stroke="${c}" stroke-width="1.5"></circle>`,
wave:c=>`<path d="M2.6 8.2c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6M2.6 14c2.5 0 2.5-2.6 5-2.6s2.5 2.6 5 2.6 2.4-2.6 4.9-2.6" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
shield:c=>`<path d="M10 2.8l6 2v4.8c0 3.7-2.5 6.5-6 8.1-3.5-1.6-6-4.4-6-8.1V4.8Z" fill="none" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"></path><path d="M7.4 9.8l1.9 1.9 3.4-3.9" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>`,
plus:c=>`<circle cx="10" cy="10" r="7" fill="none" stroke="${c}" stroke-width="1.5"></circle><path d="M10 6.6v6.8M6.6 10h6.8" stroke="${c}" stroke-width="1.5" stroke-linecap="round"></path>`,
cross:c=>`<path d="M5.4 5.4l9.2 9.2M14.6 5.4l-9.2 9.2" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
key:c=>`<circle cx="6.6" cy="6.6" r="3.1" fill="none" stroke="${c}" stroke-width="1.6"></circle><path d="M8.9 8.9l7.6 7.6M13.6 13.6l1.9-1.9M15.4 15.4l1.4-1.4" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path>`,
window:c=>`<rect x="4" y="3.5" width="12" height="13" rx="1" fill="none" stroke="${c}" stroke-width="1.6"></rect><path d="M10 3.5v13M4 10h12" stroke="${c}" stroke-width="1.4"></path>`,
desk:c=>`<path d="M2.8 9.5h14.4M4.2 9.5V16M15.8 9.5V16" stroke="${c}" stroke-width="1.6" stroke-linecap="round"></path><path d="M11.5 9.5V7.2h3.3a1.6 1.6 0 0 0-1.6-1.6h-1.7Z" fill="none" stroke="${c}" stroke-width="1.4" stroke-linejoin="round"></path><path d="M6.8 6.6v2.9" stroke="${c}" stroke-width="1.5" stroke-linecap="round"></path><path d="M5.2 4.4h3.2l-.6 2.2H5.8Z" fill="none" stroke="${c}" stroke-width="1.4" stroke-linejoin="round"></path>`
};

// ---------- grayscale/palette scene builders (340x200, ground y=178) ----------
function CHIP(C,x,y,r){r=r||10;return `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.chip}"></circle><path d="M${x-4.5} ${y}l3 3 5-5.6" fill="none" stroke="${C.chipMark}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`;}
function GROUND(C){return `<path d="M16 178 H 324" stroke="${C.ground}" stroke-width="2" stroke-linecap="round"></path>`;}
function SPARK(C,x,y,s,f){f=f||C.amber;return `<path d="M${x} ${y-s}l${s*0.3} ${s*0.7} ${s*0.7} ${s*0.3} -${s*0.7} ${s*0.3} -${s*0.3} ${s*0.7} -${s*0.3} -${s*0.7} -${s*0.7} -${s*0.3} ${s*0.7} -${s*0.3}Z" fill="${f}"></path>`;}
function CRESC(C,x,y){return `<path d="M${x} ${y} A15 15 0 1 1 ${x-15} ${y+18} A19 19 0 0 0 ${x} ${y}Z" fill="${C.g3}"></path>`;}
function DOTS(C,list){return list.map(d=>`<circle cx="${d[0]}" cy="${d[1]}" r="${d[2]||1.5}" fill="${d[3]||C.g4}"></circle>`).join('');}
globalThis.GS = {
bedNight:(C,v)=>`
  ${CRESC(C,296,22)}
  ${DOTS(C,[[252,20,1.8,C.g3],[322,52,1.5,C.g4],[270,58,1.3,C.g5]])}
  <rect x="28" y="86" width="12" height="70" rx="4" fill="${C.g2}"></rect>
  <rect x="38" y="118" width="120" height="32" rx="9" fill="${C.g6}"></rect>
  <rect x="46" y="107" width="38" height="16" rx="7" fill="${C.g4}"></rect>
  <rect x="38" y="131" width="120" height="12" fill="${C.g4}"></rect>
  <rect x="46" y="150" width="7" height="28" rx="2.5" fill="${C.g1}"></rect><rect x="146" y="150" width="7" height="28" rx="2.5" fill="${C.g1}"></rect>
  ${GROUND(C)}
  <rect x="252" y="94" width="60" height="84" rx="6" fill="${C.g5}"></rect>
  <rect x="259" y="104" width="46" height="30" rx="4" fill="${C.g3}"></rect>
  <rect x="259" y="140" width="46" height="30" rx="4" fill="${C.g3}"></rect>
  <rect x="275" y="116" width="14" height="4" rx="2" fill="${C.paper}"></rect><rect x="275" y="152" width="14" height="4" rx="2" fill="${C.paper}"></rect>
  <rect x="272" y="62" width="19" height="30" rx="4" fill="${C.focal}"></rect>
  <rect x="275.5" y="66.5" width="12" height="19" rx="2" fill="${C.focalD}"></rect>
  ${CHIP(C,296,58)}`,
tidy:(C,v)=>`
  <rect x="36" y="34" width="106" height="88" rx="6" fill="${C.g5}"></rect>
  <rect x="43" y="41" width="92" height="74" rx="3" fill="${C.paper}"></rect>
  <rect x="86" y="41" width="5" height="74" fill="${C.g5}"></rect>
  <rect x="43" y="74" width="92" height="5" fill="${C.g5}"></rect>
  <rect x="28" y="30" width="11" height="96" rx="4" fill="${C.g3}"></rect>
  <rect x="140" y="30" width="11" height="96" rx="4" fill="${C.g3}"></rect>
  <circle cx="${v?66:110}" cy="60" r="9" fill="${C.amber}" opacity="0.7"></circle>
  ${SPARK(C,176,58,7,C.g4)}${SPARK(C,206,88,5,C.amber)}${SPARK(C,160,104,4,C.g5)}
  <rect x="196" y="128" width="112" height="30" rx="9" fill="${C.g6}"></rect>
  <rect x="204" y="117" width="36" height="15" rx="7" fill="${C.g4}"></rect>
  <rect x="196" y="140" width="112" height="11" fill="${C.g4}"></rect>
  <rect x="202" y="158" width="7" height="20" rx="2.5" fill="${C.g1}"></rect><rect x="296" y="158" width="7" height="20" rx="2.5" fill="${C.g1}"></rect>
  <rect x="152" y="140" width="34" height="38" rx="6" fill="${C.g4}"></rect>
  <path d="M156 148h26M156 156h26M156 164h26" stroke="${C.paper}" stroke-width="2.5"></path>
  <path d="M64 178c-3-15 3-26 11-26s14 11 11 26Z" fill="${C.focal}"></path>
  <circle cx="75" cy="149" r="4" fill="${C.focalD}"></circle>
  ${GROUND(C)}
  ${CHIP(C,96,140)}`,
outdoors:(C,v)=>`
  <circle cx="284" cy="42" r="15" fill="${C.amber}" opacity="0.85"></circle>
  <rect x="216" y="30" width="34" height="10" rx="5" fill="${C.g6}"></rect>
  <rect x="52" y="48" width="28" height="9" rx="4.5" fill="${C.g6}"></rect>
  <circle cx="76" cy="86" r="27" fill="${C.g5}"></circle>
  <circle cx="112" cy="98" r="20" fill="${C.g4}"></circle>
  <rect x="70" y="106" width="9" height="72" rx="3" fill="${C.g2}"></rect>
  <rect x="108" y="114" width="7" height="64" rx="3" fill="${C.g2}"></rect>
  <path d="M138 178 Q 200 148 248 128 L 258 134 Q 214 154 168 178 Z" fill="${C.g6}"></path>
  ${v?`<rect x="242" y="150" width="40" height="18" rx="8" fill="${C.g5}"></rect><rect x="252" y="140" width="26" height="9" rx="3" fill="${C.focal}"></rect>${DOTS(C,[[288,128,1.6],[296,120,1.6],[304,112,1.6]])}`
   :`<rect x="238" y="146" width="54" height="8" rx="3" fill="${C.g4}"></rect><rect x="244" y="154" width="5" height="24" rx="2" fill="${C.g1}"></rect><rect x="282" y="154" width="5" height="24" rx="2" fill="${C.g1}"></rect>`}
  <circle cx="196" cy="118" r="7" fill="${C.focal}"></circle>
  <path d="M196 126c-8 0-10 9-10 18h20c0-9-2-18-10-18Z" fill="${C.focal}"></path>
  ${GROUND(C)}
  ${CHIP(C,220,102)}`,
alarm:(C,v)=>`
  ${v===1?`<circle cx="44" cy="38" r="13" fill="${C.amber}" opacity="0.85"></circle>`:CRESC(C,52,26)}
  ${DOTS(C,[[96,30,1.5,C.g4],[130,52,1.3,C.g5]])}
  <rect x="58" y="112" width="88" height="66" rx="8" fill="${C.g5}"></rect>
  <rect x="66" y="124" width="72" height="20" rx="4" fill="${C.g4}"></rect>
  <rect x="94" y="132" width="16" height="4" rx="2" fill="${C.paper}"></rect>
  <circle cx="102" cy="84" r="21" fill="${C.focal}"></circle>
  <circle cx="88" cy="66" r="6" fill="${C.focal}"></circle><circle cx="116" cy="66" r="6" fill="${C.focal}"></circle>
  <path d="M102 84V71M102 84l9 5" stroke="${C.chipMark}" stroke-width="3" stroke-linecap="round"></path>
  ${v===2?`<rect x="168" y="140" width="52" height="12" rx="4" fill="${C.g6}"></rect><rect x="172" y="128" width="44" height="12" rx="4" fill="${C.g4}"></rect><rect x="176" y="116" width="36" height="12" rx="4" fill="${C.g5}"></rect><path d="M232 178c0-20 8-30 20-30s20 10 20 30Z" fill="${C.g3}"></path>`:''}
  <rect x="232" y="118" width="84" height="9" rx="3.5" fill="${C.g4}"></rect>
  <rect x="240" y="127" width="7" height="51" rx="3" fill="${C.g2}"></rect>
  <rect x="254" y="106" width="36" height="12" rx="4" fill="${C.focal}"></rect>
  ${DOTS(C,[[300,92,1.8,C.g3],[308,84,1.5,C.g4],[316,76,1.3,C.g5]])}
  ${GROUND(C)}
  ${CHIP(C,306,110)}`,
desk:(C,v)=>`
  <rect x="48" y="120" width="250" height="10" rx="4" fill="${C.g5}"></rect>
  <rect x="60" y="130" width="8" height="48" rx="3" fill="${C.g3}"></rect>
  <rect x="278" y="130" width="8" height="48" rx="3" fill="${C.g3}"></rect>
  <path d="M84 120V94L110 80" stroke="${C.g2}" stroke-width="6" stroke-linecap="round" fill="none"></path>
  <rect x="100" y="68" width="30" height="15" rx="7" fill="${C.g4}"></rect>
  <path d="M114 84 L98 118 L146 118 Z" fill="${C.amber}" opacity="0.3"></path>
  ${v===1?`<rect x="158" y="112" width="66" height="7" rx="3" fill="${C.g4}"></rect><rect x="162" y="74" width="58" height="38" rx="4" fill="${C.focal}"></rect><path d="M170 84h18M170 92h26M170 100h14" stroke="${C.focalD}" stroke-width="3" stroke-linecap="round"></path>`
   :v===2?`<rect x="156" y="96" width="64" height="24" rx="3" fill="${C.g6}"></rect><rect x="162" y="88" width="64" height="24" rx="3" fill="${C.paper}" transform="rotate(-4 194 100)"></rect><path d="M170 96h40M170 103h30" stroke="${C.g4}" stroke-width="2.6" transform="rotate(-4 194 100)"></path><rect x="228" y="104" width="34" height="7" rx="3.5" fill="${C.focal}" transform="rotate(24 245 107)"></rect>`
   :`<path d="M158 118l32-8v-28l-32 8Z" fill="${C.paper}"></path><path d="M222 118l-32-8v-28l32 8Z" fill="${C.g7}"></path><path d="M190 82v28" stroke="${C.g3}" stroke-width="2"></path><path d="M166 96l18-4.5M166 104l18-4.5M196 91.5l18 4.5M196 99.5l18 4.5" stroke="${C.g4}" stroke-width="2.4"></path>`}
  <rect x="240" y="102" width="21" height="18" rx="3" fill="${C.g4}"></rect>
  <path d="M261 106h5a4 4 0 0 1 0 8h-5" fill="none" stroke="${C.g4}" stroke-width="3"></path>
  <path d="M246 96c0-4 3-4 3-8M254 96c0-4 3-4 3-8" stroke="${C.g6}" stroke-width="2.5" fill="none" stroke-linecap="round"></path>
  ${GROUND(C)}
  ${CHIP(C,288,74)}`,
people:(C,v)=>`
  <rect x="128" y="132" width="88" height="10" rx="4" fill="${C.g5}"></rect>
  <rect x="164" y="142" width="9" height="36" rx="3" fill="${C.g3}"></rect>
  <circle cx="112" cy="96" r="12" fill="${C.g2}"></circle>
  <path d="M112 110c-16 0-20 14-20 30h40c0-16-4-30-20-30Z" fill="${C.g2}"></path>
  ${v===1?`<circle cx="66" cy="104" r="10" fill="${C.g4}"></circle><path d="M66 116c-13 0-16 12-16 24h32c0-12-3-24-16-24Z" fill="${C.g4}"></path>`:''}
  <circle cx="230" cy="94" r="12" fill="${C.focal}"></circle>
  <path d="M230 108c-16 0-20 14-20 30h40c0-16-4-30-20-30Z" fill="${C.focal}"></path>
  <rect x="146" y="120" width="14" height="13" rx="2.5" fill="${C.paper}"></rect>
  <rect x="184" y="120" width="14" height="13" rx="2.5" fill="${C.paper}"></rect>
  <rect x="128" y="44" width="66" height="28" rx="10" fill="${C.paper}"></rect>
  <path d="M140 76l-4 10 14-10Z" fill="${C.paper}"></path>
  <path d="M140 54h42M140 62h30" stroke="${C.g4}" stroke-width="2.6" stroke-linecap="round"></path>
  <rect x="212" y="52" width="40" height="22" rx="9" fill="${C.g6}"></rect>
  <path d="M240 74l6 8 0-10Z" fill="${C.g6}"></path>
  ${GROUND(C)}
  ${CHIP(C,272,52)}`,
reward:(C,v)=>`
  <path d="M100 178 L120 116 L140 178 Z" fill="${C.g2}"></path>
  <path d="M107 158l24-14M104 144l22-13M112 170l22-13" stroke="${C.paper}" stroke-width="2" stroke-linecap="round"></path>
  <circle cx="120" cy="106" r="23" fill="${C.g6}"></circle>
  <circle cx="108" cy="98" r="8" fill="${C.g7}"></circle>
  <circle cx="120" cy="82" r="5.5" fill="${C.amber}"></circle>
  <rect x="196" y="118" width="92" height="42" rx="7" fill="${C.paper}"></rect>
  <path d="M254 118v42" stroke="${C.g4}" stroke-width="2.4" stroke-dasharray="3 5"></path>
  <path d="M206 132h30M206 142h22" stroke="${C.g4}" stroke-width="2.6" stroke-linecap="round"></path>
  ${SPARK(C,268,138,6,C.g3)}
  ${SPARK(C,80,66,8,C.amber)}${SPARK(C,168,52,6,C.g4)}${SPARK(C,252,80,5,C.g5)}
  ${GROUND(C)}
  ${CHIP(C,296,102)}`,
journal:(C,v)=> v===1?`
  <circle cx="170" cy="52" r="7" fill="${C.focal}"></circle><circle cx="167.5" cy="49.5" r="2" fill="${C.chipMark}"></circle>
  <g transform="rotate(1.5 170 110)"><rect x="104" y="58" width="132" height="96" rx="6" fill="${C.paper}"></rect>
  <path d="M236 154l-14-14 14 0Z" fill="${C.g6}"></path>
  <path d="M118 78h100M118 96h100M118 114h72M118 132h84" stroke="${C.g4}" stroke-width="2.8" stroke-linecap="round"></path></g>
  ${CRESC(C,296,30)}${DOTS(C,[[262,26,1.5,C.g4]])}
  <rect x="250" y="122" width="56" height="9" rx="4" fill="${C.focal}" transform="rotate(-32 278 126)"></rect>
  <path d="M300 96l10 6-6 4Z" fill="${C.focalD}"></path>
  ${GROUND(C)}<rect x="96" y="170" width="150" height="8" rx="4" fill="${C.g6}"></rect>
  ${CHIP(C,268,64)}`
 : v===2?`
  <g transform="rotate(2 236 128)"><rect x="176" y="88" width="120" height="80" rx="6" fill="${C.g7}"></rect>
  <path d="M188 106h96M188 122h72M188 138h84" stroke="${C.g4}" stroke-width="2.6" stroke-linecap="round"></path></g>
  <g transform="rotate(-2 144 114)"><rect x="84" y="74" width="120" height="80" rx="6" fill="${C.paper}"></rect>
  <path d="M96 92h96M96 124h80" stroke="${C.g4}" stroke-width="2.6" stroke-linecap="round"></path>
  <rect x="96" y="102" width="80" height="9" rx="3" fill="${C.amber}" opacity="0.7"></rect></g>
  <rect x="216" y="52" width="58" height="9" rx="4" fill="${C.focal}" transform="rotate(18 244 56)"></rect>
  ${GROUND(C)}${DOTS(C,[[64,52,1.6,C.g4],[300,40,1.4,C.g5]])}
  ${CHIP(C,74,90)}`
 : `
  <g transform="rotate(-2 172 110)"><rect x="92" y="58" width="160" height="104" rx="8" fill="${C.paper}"></rect>
  <path d="M124 84h108M124 110h108M124 136h74" stroke="${C.g4}" stroke-width="2.8" stroke-linecap="round"></path>
  <path d="M104 82l4 4 7-8M104 108l4 4 7-8M104 134l4 4 7-8" fill="none" stroke="${C.focal}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path></g>
  <rect x="226" y="140" width="58" height="9" rx="4" fill="${C.focal}" transform="rotate(28 254 144)"></rect>
  <path d="M280 166l10 7-7 3Z" fill="${C.focalD}"></path>
  ${DOTS(C,[[70,44,1.6,C.g4],[286,44,1.4,C.g5]])}
  ${GROUND(C)}
  ${CHIP(C,282,66)}`,
steps:(C,v)=> v===2?`
  <path d="M170 66 A46 46 0 0 1 216 112" fill="none" stroke="${C.g3}" stroke-width="7" stroke-linecap="round"></path>
  <path d="M216 104l6 10-12 2Z" fill="${C.g3}"></path>
  <path d="M170 158 A46 46 0 0 1 124 112" fill="none" stroke="${C.g3}" stroke-width="7" stroke-linecap="round"></path>
  <path d="M124 120l-6-10 12-2Z" fill="${C.g3}"></path>
  <circle cx="170" cy="112" r="26" fill="${C.paper}"></circle>
  <circle cx="160" cy="112" r="3" fill="${C.focal}"></circle><circle cx="170" cy="112" r="3" fill="${C.focal}"></circle><circle cx="180" cy="112" r="3" fill="${C.focal}"></circle>
  <rect x="252" y="94" width="52" height="84" rx="5" fill="${C.g5}"></rect>
  <rect x="259" y="101" width="34" height="77" fill="${C.g6}" transform="skewY(-4)"></rect>
  ${GROUND(C)}
  ${CHIP(C,300,64)}`
 : `
  <rect x="60" y="166" width="46" height="12" rx="6" fill="${C.g4}"></rect>
  <rect x="122" y="152" width="46" height="12" rx="6" fill="${C.g5}"></rect>
  <rect x="184" y="138" width="46" height="12" rx="6" fill="${C.g4}"></rect>
  <rect x="246" y="124" width="46" height="12" rx="6" fill="${C.g5}"></rect>
  ${v===1?`<path d="M112 158l8-4M174 144l8-4M236 130l8-4" stroke="${C.g2}" stroke-width="3" stroke-linecap="round"></path><circle cx="152" cy="132" r="6" fill="${C.focal}"></circle><path d="M152 138c-6 0-8 6-8 12h16c0-6-2-12-8-12Z" fill="${C.focal}"></path>`
   :`<ellipse cx="74" cy="172" rx="6" ry="3.4" fill="${C.focal}"></ellipse><ellipse cx="88" cy="172" rx="6" ry="3.4" fill="${C.focal}"></ellipse>`}
  <rect x="268" y="44" width="48" height="80" rx="5" fill="${C.g5}"></rect>
  <rect x="275" y="51" width="30" height="73" fill="${C.g3}" transform="skewY(-6)"></rect>
  <path d="M275 122 L240 178 L316 178 316 122Z" fill="${C.amber}" opacity="0.25"></path>
  <circle cx="299" cy="88" r="2.6" fill="${C.paper}"></circle>
  ${GROUND(C)}
  ${CHIP(C,312,34)}`,
compare:(C,v)=>`
  <rect x="58" y="70" width="106" height="98" rx="10" fill="${C.g6}"></rect>
  <rect x="186" y="70" width="106" height="98" rx="10" fill="${C.paper}"></rect>
  ${v===1?`<path d="M74 128l14-24 12 18 13-30 12 22" fill="none" stroke="${C.g2}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M202 122c10-10 18-10 28 0s18 10 28 0" fill="none" stroke="${C.g3}" stroke-width="4" stroke-linecap="round"></path>`
  :v===2?`${CRESC(C,116,88)}<rect x="82" y="128" width="14" height="24" rx="3" fill="${C.g3}"></rect><rect x="104" y="120" width="14" height="32" rx="3" fill="${C.g3}"></rect>
  <circle cx="238" cy="98" r="13" fill="${C.amber}" opacity="0.9"></circle><rect x="210" y="120" width="14" height="32" rx="3" fill="${C.g2}"></rect><rect x="232" y="110" width="14" height="42" rx="3" fill="${C.g2}"></rect><rect x="254" y="100" width="14" height="52" rx="3" fill="${C.focal}"></rect>`
  :`<rect x="74" y="118" width="16" height="34" rx="3" fill="${C.g3}"></rect><rect x="98" y="100" width="16" height="52" rx="3" fill="${C.g3}"></rect><rect x="122" y="126" width="16" height="26" rx="3" fill="${C.g3}"></rect>
  <rect x="202" y="126" width="16" height="26" rx="3" fill="${C.g2}"></rect><rect x="226" y="112" width="16" height="40" rx="3" fill="${C.g2}"></rect><rect x="250" y="94" width="16" height="58" rx="3" fill="${C.focal}"></rect>`}
  <path d="M166 116h16" stroke="${C.g2}" stroke-width="4" stroke-linecap="round"></path>
  <path d="M180 110l8 6-8 6Z" fill="${C.g2}"></path>
  <rect x="74" y="84" width="30" height="7" rx="3.5" fill="${C.g4}"></rect>
  <rect x="202" y="84" width="30" height="7" rx="3.5" fill="${C.g4}"></rect>
  ${GROUND(C)}
  ${CHIP(C,282,60)}`,
calendar:(C,v)=>`
  <rect x="94" y="52" width="156" height="116" rx="10" fill="${C.paper}"></rect>
  <rect x="94" y="52" width="156" height="27" rx="10" fill="${C.g4}"></rect>
  <rect x="94" y="68" width="156" height="11" fill="${C.g4}"></rect>
  <rect x="122" y="44" width="9" height="17" rx="4.5" fill="${C.g2}"></rect>
  <rect x="212" y="44" width="9" height="17" rx="4.5" fill="${C.g2}"></rect>
  ${[0,1,2,3].map(r=>[0,1,2,3,4].map(c=>{
    const x=112+c*28, y=94+r*19;
    if(v===0&&r===1&&c===2) return `<rect x="${x-8}" y="${y-7}" width="17" height="15" rx="4" fill="${C.focal}"></rect><path d="M${x-4} ${y}l2.6 2.6 4.6-5.2" fill="none" stroke="${C.chipMark}" stroke-width="2" stroke-linecap="round"></path>`;
    if(v===1&&r===2&&(c===1||c===2)) return `<rect x="${x-8}" y="${y-7}" width="${c===1?45:0}" height="15" rx="4" fill="${C.amber}" opacity="0.9"></rect>`+(c===2?`<circle cx="${x}" cy="${y}" r="2.4" fill="${C.g5}"></circle>`:'');
    if(v===2&&((r===0&&c===1)||(r===1&&c===2)||(r===2&&c===3)||(r===3&&c===4))) return `<circle cx="${x}" cy="${y}" r="5.5" fill="${C.focal}"></circle>`;
    return `<circle cx="${x}" cy="${y}" r="2.4" fill="${C.g5}"></circle>`;
  }).join('')).join('')}
  ${v===1?`<circle cx="268" cy="118" r="15" fill="none" stroke="${C.g3}" stroke-width="4"></circle><path d="M268 110v8l6 4" fill="none" stroke="${C.g3}" stroke-width="3.5" stroke-linecap="round"></path>`:''}
  ${v===2?`<path d="M262 88a20 20 0 0 1 20 20M282 128a20 20 0 0 1-20 20" fill="none" stroke="${C.g3}" stroke-width="4" stroke-linecap="round"></path>`:''}
  <rect x="56" y="128" width="52" height="9" rx="4" fill="${C.focal}" transform="rotate(-56 82 132)"></rect>
  ${DOTS(C,[[66,44,1.6,C.g4],[288,40,1.4,C.g5]])}
  ${GROUND(C)}<rect x="86" y="170" width="170" height="8" rx="4" fill="${C.g6}"></rect>
  ${CHIP(C,272,56)}`,
heart:(C,v)=>`
  <path d="M170 152 C 126 122 114 94 128 74 C 138 60 162 62 170 80 C 178 62 202 60 212 74 C 226 94 214 122 170 152 Z" fill="${C.g6}"></path>
  <path d="M170 134 C 146 116 140 100 148 88 C 153 80 166 81 170 91 C 174 81 187 80 192 88 C 200 100 194 116 170 134 Z" fill="${C.amber}" opacity="0.55"></path>
  <path d="M96 142 Q 120 128 140 138" fill="none" stroke="${C.g3}" stroke-width="7" stroke-linecap="round"></path>
  <path d="M244 142 Q 220 128 200 138" fill="none" stroke="${C.g3}" stroke-width="7" stroke-linecap="round"></path>
  ${v===1?`<circle cx="112" cy="64" r="16" fill="${C.focal}"></circle><path d="M112 64v-9M112 64l6 4" stroke="${C.chipMark}" stroke-width="2.6" stroke-linecap="round"></path>`:''}
  ${v===2?`<rect x="196" y="60" width="44" height="13" rx="4" fill="${C.paper}" transform="rotate(38 218 66)"></rect><rect x="196" y="60" width="44" height="13" rx="4" fill="${C.g4}" transform="rotate(-38 218 66)"></rect>`:''}
  ${SPARK(C,238,58,6,C.g4)}${SPARK(C,102,96,5,C.g5)}
  ${GROUND(C)}<rect x="112" y="170" width="116" height="8" rx="4" fill="${C.g6}"></rect>
  ${CHIP(C,258,102)}`,
shield:(C,v)=>`
  ${v===2?`<circle cx="238" cy="66" r="22" fill="${C.amber}" opacity="0.8"></circle>`:''}
  <path d="M170 46 L 228 64 V 112 C 228 146 202 166 170 178 C 138 166 112 146 112 112 V 64 Z" fill="${C.g6}"></path>
  <path d="M170 58 L 216 72 V 112 C 216 140 196 156 170 166 C 144 156 124 140 124 112 V 72 Z" fill="${C.paper}"></path>
  <path d="M148 112 l16 16 30 -36" fill="none" stroke="${C.focal}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"></path>
  <rect x="42" y="56" width="40" height="13" rx="6.5" fill="${C.g4}"></rect>
  <rect x="56" y="66" width="34" height="11" rx="5.5" fill="${C.g5}"></rect>
  <path d="M56 84l-4 9M70 84l-4 9M84 84l-4 9" stroke="${C.g3}" stroke-width="2.6" stroke-linecap="round"></path>
  ${v===1?`<path d="M252 96h44M252 118h44M252 140h34" stroke="${C.g4}" stroke-width="3" stroke-linecap="round"></path><path d="M244 92l3 3 5-6M244 114l3 3 5-6M244 136l3 3 5-6" fill="none" stroke="${C.g2}" stroke-width="2.4" stroke-linecap="round"></path>`:''}
  ${GROUND(C)}
  ${DOTS(C,[[290,46,1.6,C.g4],[64,120,1.4,C.g5]])}`,
wave:(C,v)=>`
  <path d="M24 152 C 90 152 110 84 170 84 C 212 84 226 118 254 134 C 272 144 300 150 316 150 L 316 178 L 24 178 Z" fill="${C.g6}"></path>
  <path d="M24 152 C 90 152 110 84 170 84 C 212 84 226 118 254 134 C 272 144 300 150 316 150" fill="none" stroke="${C.g2}" stroke-width="5" stroke-linecap="round"></path>
  ${v===1?`<circle cx="286" cy="60" r="17" fill="none" stroke="${C.g3}" stroke-width="5"></circle><path d="M286 60V47" stroke="${C.g3}" stroke-width="4" stroke-linecap="round"></path><path d="M286 60 A17 17 0 0 1 301 69" fill="none" stroke="${C.amber}" stroke-width="5"></path>`:''}
  ${v===2?`<path d="M44 64c8-10 16-10 24 0s16 10 24 0" fill="none" stroke="${C.g3}" stroke-width="4" stroke-linecap="round"></path><path d="M246 64c14-16 28-16 42 0" fill="none" stroke="${C.g3}" stroke-width="4" stroke-linecap="round"></path><path d="M116 60h96" stroke="${C.g4}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 8"></path><path d="M206 54l10 6-10 6Z" fill="${C.g4}"></path>`:''}
  <circle cx="170" cy="76" r="8" fill="${C.focal}"></circle>
  <path d="M158 88l24-6" stroke="${C.focal}" stroke-width="4" stroke-linecap="round"></path>
  <path d="M60 166v-8M170 166v-8M280 166v-8" stroke="${C.g2}" stroke-width="3" stroke-linecap="round"></path>
  ${DOTS(C,[[60,150,2.2,C.g2],[170,144,2.2,C.g2],[280,142,2.2,C.g2]])}
  ${GROUND(C)}
  ${CHIP(C,312,116)}`,
phoneAway:(C,v)=> v===1?`
  <rect x="248" y="66" width="56" height="112" rx="5" fill="${C.g5}"></rect>
  <rect x="255" y="73" width="36" height="105" fill="${C.g3}" transform="skewY(-5)"></rect>
  <circle cx="262" cy="128" r="3" fill="${C.paper}"></circle>
  <rect x="120" y="100" width="72" height="8" rx="3" fill="${C.g4}"></rect>
  <rect x="130" y="108" width="6" height="70" rx="3" fill="${C.g2}"></rect>
  <rect x="140" y="88" width="34" height="12" rx="3" fill="${C.focal}"></rect>
  <path d="M196 82 Q 226 58 252 72" fill="none" stroke="${C.g3}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 7"></path>
  <path d="M60 120c6-8 14-8 20 0" fill="none" stroke="${C.g4}" stroke-width="3" stroke-linecap="round"></path>
  ${GROUND(C)}
  ${CHIP(C,160,68)}`
 : v===2?`
  <rect x="48" y="120" width="118" height="9" rx="4" fill="${C.g5}"></rect>
  <rect x="58" y="129" width="7" height="49" rx="3" fill="${C.g3}"></rect><rect x="148" y="129" width="7" height="49" rx="3" fill="${C.g3}"></rect>
  <ellipse cx="107" cy="114" rx="26" ry="7" fill="${C.paper}"></ellipse>
  <ellipse cx="107" cy="113" rx="16" ry="4" fill="${C.g5}"></ellipse>
  <path d="M100 100c0-4 3-4 3-8M110 100c0-4 3-4 3-8" stroke="${C.g5}" stroke-width="2.4" fill="none" stroke-linecap="round"></path>
  <rect x="232" y="110" width="86" height="10" rx="4" fill="${C.g4}"></rect>
  <rect x="242" y="120" width="8" height="58" rx="3" fill="${C.g2}"></rect><rect x="300" y="120" width="8" height="58" rx="3" fill="${C.g2}"></rect>
  <rect x="256" y="98" width="36" height="12" rx="3" fill="${C.focal}"></rect>
  ${GROUND(C)}
  ${CHIP(C,306,84)}`
 : `
  <rect x="36" y="130" width="98" height="28" rx="8" fill="${C.g6}"></rect>
  <rect x="42" y="120" width="32" height="14" rx="6" fill="${C.g4}"></rect>
  <rect x="36" y="142" width="98" height="10" fill="${C.g4}"></rect>
  <rect x="42" y="158" width="6" height="20" rx="2.5" fill="${C.g1}"></rect><rect x="124" y="158" width="6" height="20" rx="2.5" fill="${C.g1}"></rect>
  <path d="M110 114 Q 180 54 258 82" fill="none" stroke="${C.g3}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 7"></path>
  <rect x="236" y="94" width="86" height="8" rx="3" fill="${C.g4}"></rect>
  <path d="M244 102l-6 14M314 102l6 14" stroke="${C.g4}" stroke-width="4" stroke-linecap="round"></path>
  <rect x="258" y="82" width="38" height="12" rx="3" fill="${C.focal}"></rect>
  ${CRESC(C,306,34)}
  ${GROUND(C)}
  ${CHIP(C,236,60)}`,
timer:(C,v)=>`
  <circle cx="150" cy="110" r="54" fill="none" stroke="${C.g5}" stroke-width="11"></circle>
  <path d="M150 56 A54 54 0 0 1 ${v===1?'201 92':'196 78'}" fill="none" stroke="${C.focal}" stroke-width="11" stroke-linecap="round"></path>
  <circle cx="150" cy="110" r="37" fill="${C.paper}"></circle>
  <path d="M150 110V84" stroke="${C.g2}" stroke-width="4" stroke-linecap="round"></path>
  <path d="M150 110l16 10" stroke="${C.g2}" stroke-width="4" stroke-linecap="round"></path>
  <circle cx="150" cy="110" r="5" fill="${C.focal}"></circle>
  <rect x="141" y="42" width="18" height="8" rx="3" fill="${C.g2}"></rect>
  ${v===2?`<rect x="240" y="108" width="24" height="20" rx="3" fill="${C.g4}"></rect><path d="M264 112h5a4.5 4.5 0 0 1 0 9h-5" fill="none" stroke="${C.g4}" stroke-width="3"></path><path d="M247 100c0-4 3-4 3-8M256 100c0-4 3-4 3-8" stroke="${C.g6}" stroke-width="2.5" fill="none" stroke-linecap="round"></path>`
   :`<rect x="236" y="118" width="60" height="12" rx="3" fill="${C.g6}"></rect><rect x="242" y="106" width="48" height="12" rx="3" fill="${C.g4}"></rect><rect x="248" y="94" width="36" height="12" rx="3" fill="${C.g5}"></rect>`}
  <rect x="228" y="130" width="76" height="6" rx="3" fill="${C.g6}"></rect>
  ${DOTS(C,[[70,58,1.6,C.g4],[262,50,1.4,C.g5]])}
  ${GROUND(C)}
  ${CHIP(C,86,132)}`,
quiet:(C,v)=>`
  <rect x="246" y="42" width="74" height="72" rx="6" fill="${C.g5}"></rect>
  <rect x="252" y="48" width="62" height="60" rx="3" fill="${C.paper}"></rect>
  ${CRESC(C,292,58)}
  <rect x="252" y="74" width="62" height="4" fill="${C.g5}"></rect>
  <rect x="70" y="70" width="26" height="72" rx="9" fill="${C.g5}"></rect>
  <rect x="70" y="116" width="100" height="46" rx="12" fill="${C.g6}"></rect>
  <rect x="88" y="104" width="72" height="24" rx="9" fill="${C.g4}"></rect>
  <rect x="156" y="98" width="22" height="64" rx="9" fill="${C.g5}"></rect>
  <rect x="76" y="162" width="8" height="16" rx="3" fill="${C.g1}"></rect><rect x="162" y="162" width="8" height="16" rx="3" fill="${C.g1}"></rect>
  ${v===1?`<rect x="104" y="92" width="34" height="10" rx="3" fill="${C.paper}" transform="rotate(-8 121 97)"></rect>`:''}
  <rect x="196" y="126" width="52" height="7" rx="3" fill="${C.g4}"></rect>
  <rect x="216" y="133" width="8" height="45" rx="3" fill="${C.g2}"></rect>
  <rect x="206" y="106" width="18" height="20" rx="3" fill="${C.g4}"></rect>
  <path d="M211 98c0-4 3-4 3-8M219 98c0-4 3-4 3-8" stroke="${C.g5}" stroke-width="2.4" fill="none" stroke-linecap="round"></path>
  ${v===2?`<rect x="290" y="128" width="26" height="8" rx="3" fill="${C.focal}"></rect><path d="M296 122c2-3 6-3 8 0" fill="none" stroke="${C.g3}" stroke-width="2.4" stroke-linecap="round"></path>`:`<rect x="278" y="120" width="30" height="9" rx="3" fill="${C.focal}"></rect>`}
  <ellipse cx="128" cy="180" rx="76" ry="6" fill="${C.g7}"></ellipse>
  ${GROUND(C)}
  ${CHIP(C,52,52)}`,
sunrise:(C,v)=>`
  <circle cx="170" cy="98" r="26" fill="${C.amber}" opacity="0.9"></circle>
  <circle cx="170" cy="98" r="15" fill="${C.paper}" opacity="0.85"></circle>
  <path d="M170 52v-12M212 62l8-8M128 62l-8-8M226 98h12M114 98h-12" stroke="${C.g3}" stroke-width="3.5" stroke-linecap="round"></path>
  <path d="M20 178 Q 104 118 192 148 T 324 146 L 324 178 Z" fill="${C.g6}"></path>
  <path d="M118 178 Q 212 130 324 158 L 324 178 Z" fill="${C.g5}"></path>
  ${v===2?`<path d="M40 176 Q 130 158 210 150" fill="none" stroke="${C.paper}" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 14"></path>`
   :`<path d="M56 176 Q 120 160 176 146" fill="none" stroke="${C.g2}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 8"></path>`}
  ${v===1?`<rect x="52" y="76" width="56" height="44" rx="5" fill="${C.paper}"></rect><path d="M62 88h36M62 98h28M62 108h32" stroke="${C.g4}" stroke-width="2.6" stroke-linecap="round"></path>`
   :`<rect x="80" y="112" width="8" height="60" rx="3" fill="${C.focal}"></rect><path d="M88 116h44l10 8-10 8H88Z" fill="${C.focal}"></path>`}
  ${DOTS(C,[[262,54,1.8,C.g4],[292,72,1.5,C.g5],[66,44,1.5,C.g4]])}
  ${GROUND(C)}
  ${CHIP(C,282,110)}`,
letter:(C,v)=> v===2?`
  <g transform="rotate(-3 116 118)"><rect x="62" y="86" width="108" height="64" rx="7" fill="${C.g7}"></rect></g>
  <g transform="rotate(2 152 122)"><rect x="94" y="90" width="112" height="66" rx="7" fill="${C.g6}"></rect></g>
  <rect x="126" y="94" width="118" height="70" rx="7" fill="${C.paper}"></rect>
  <circle cx="152" cy="120" r="13" fill="${C.g4}"></circle>
  <path d="M174 112h56M174 126h42" stroke="${C.g4}" stroke-width="3" stroke-linecap="round"></path>
  <circle cx="272" cy="76" r="14" fill="${C.amber}"></circle>
  <path d="M272 70v12M266 76h12" stroke="${C.focalD==='#3A3934'?'#131313':'#131313'}" stroke-width="2.6" stroke-linecap="round"></path>
  ${DOTS(C,[[70,54,1.6,C.g4],[300,132,1.4,C.g5]])}
  ${GROUND(C)}<rect x="96" y="170" width="150" height="8" rx="4" fill="${C.g6}"></rect>
  ${CHIP(C,96,66)}`
 : `
  ${v===1?`<rect x="96" y="70" width="124" height="88" rx="8" fill="${C.paper}"></rect>
  <circle cx="118" cy="92" r="9" fill="none" stroke="${C.g3}" stroke-width="3"></circle><path d="M118 87v5l3.4 2.4" fill="none" stroke="${C.g3}" stroke-width="2.4" stroke-linecap="round"></path>
  <path d="M140 88h64M140 102h48" stroke="${C.g4}" stroke-width="3" stroke-linecap="round"></path>
  <path d="M112 126a7 7 0 0 1 12 0c0 5-6 9-6 13" fill="none" stroke="${C.g3}" stroke-width="3" stroke-linecap="round"></path>
  <path d="M140 126h56M140 138h36" stroke="${C.g4}" stroke-width="3" stroke-linecap="round"></path>`
  :`<rect x="96" y="84" width="120" height="76" rx="8" fill="${C.paper}"></rect>
  <path d="M96 90 L156 134 216 90" fill="none" stroke="${C.g4}" stroke-width="4" stroke-linejoin="round"></path>
  <circle cx="156" cy="118" r="7" fill="${C.amber}"></circle>`}
  <path d="M244 80l50-16-34 34-4.5-13.5Z" fill="${C.focal}"></path>
  <path d="M260 98l-4 14 8-9Z" fill="${C.focalD}"></path>
  <path d="M212 62c10-6 20-8 30-6M204 46c14-9 30-12 44-8" fill="none" stroke="${C.g4}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="3 6"></path>
  ${DOTS(C,[[70,50,1.6,C.g4],[300,140,1.4,C.g5]])}
  ${GROUND(C)}<rect x="88" y="170" width="152" height="8" rx="4" fill="${C.g6}"></rect>
  ${CHIP(C,300,110)}`,
lock:(C,v)=> v===2?`
  <path d="M92 108h156v70H92Z" fill="${C.g5}"></path>
  <path d="M92 108l24-26h108l24 26Z" fill="${C.g4}"></path>
  <path d="M164 82v26" stroke="${C.g5}" stroke-width="3"></path>
  <rect x="130" y="122" width="80" height="12" rx="4" fill="${C.paper}"></rect>
  <rect x="118" y="60" width="40" height="28" rx="4" fill="${C.g6}" transform="rotate(-8 138 74)"></rect>
  <rect x="188" y="54" width="34" height="22" rx="4" fill="${C.g7}" transform="rotate(6 205 65)"></rect>
  <rect x="252" y="120" width="48" height="40" rx="8" fill="${C.focal}"></rect>
  <path d="M262 120v-10a14 14 0 0 1 28 0v10" fill="none" stroke="${C.focal}" stroke-width="8"></path>
  <circle cx="276" cy="136" r="5" fill="${C.chipMark}"></circle><rect x="273.5" y="138" width="5" height="10" rx="2.5" fill="${C.chipMark}"></rect>
  ${GROUND(C)}
  ${CHIP(C,74,70)}`
 : `
  <rect x="70" y="64" width="150" height="98" rx="10" fill="${C.paper}"></rect>
  <rect x="70" y="64" width="150" height="24" rx="10" fill="${C.g4}"></rect>
  <rect x="70" y="77" width="150" height="11" fill="${C.g4}"></rect>
  ${DOTS(C,[[82,76,3,C.paper],[93,76,3,C.paper],[104,76,3,C.paper]])}
  <path d="M86 104h96M86 120h118M86 136h76" stroke="${C.g5}" stroke-width="4" stroke-linecap="round"></path>
  ${v===1?`<path d="M96 104l76 0" stroke="${C.g2}" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 6"></path><rect x="150" y="94" width="34" height="20" rx="4" fill="none" stroke="${C.g2}" stroke-width="3"></rect>`:''}
  <rect x="236" y="52" width="42" height="26" rx="5" fill="${C.g6}"></rect>
  <path d="M250 59l14 12M264 59l-14 12" stroke="${C.g2}" stroke-width="3" stroke-linecap="round"></path>
  <rect x="286" y="66" width="34" height="22" rx="5" fill="${C.g7}"></rect>
  <path d="M296 71l12 10M308 71l-12 10" stroke="${C.g3}" stroke-width="2.6" stroke-linecap="round"></path>
  <rect x="184" y="126" width="52" height="42" rx="9" fill="${C.focal}"></rect>
  <path d="M196 126v-12a14 14 0 0 1 28 0v12" fill="none" stroke="${C.focal}" stroke-width="9"></path>
  <circle cx="210" cy="143" r="5.5" fill="${C.chipMark}"></circle><rect x="207" y="145" width="6" height="11" rx="3" fill="${C.chipMark}"></rect>
  ${GROUND(C)}
  ${CHIP(C,296,120)}`,
meal:(C,v)=>`
  ${CRESC(C,56,28)}
  <rect x="58" y="132" width="230" height="10" rx="4" fill="${C.g5}"></rect>
  <rect x="72" y="142" width="8" height="36" rx="3" fill="${C.g3}"></rect>
  <rect x="266" y="142" width="8" height="36" rx="3" fill="${C.g3}"></rect>
  <ellipse cx="140" cy="128" rx="38" ry="9" fill="${C.paper}"></ellipse>
  <ellipse cx="140" cy="126" rx="24" ry="5.5" fill="${C.g5}"></ellipse>
  <path d="M130 112c0-5 4-5 4-10M144 112c0-5 4-5 4-10" stroke="${C.g4}" stroke-width="2.6" fill="none" stroke-linecap="round"></path>
  <rect x="204" y="102" width="19" height="30" rx="3" fill="${C.blue}" opacity="0.55"></rect>
  <rect x="204" y="112" width="19" height="20" rx="3" fill="${C.blue}"></rect>
  <rect x="240" y="90" width="16" height="42" rx="7" fill="${C.g4}"></rect>
  <rect x="244" y="82" width="8" height="10" rx="2" fill="${C.focal}"></rect>
  <path d="M96 118l8-8M104 118l-8-8" stroke="${C.g3}" stroke-width="3" stroke-linecap="round" transform="translate(-14 4)"></path>
  ${GROUND(C)}
  ${CHIP(C,296,64)}`,
kit:(C,v)=>`
  <rect x="52" y="148" width="236 " height="9" rx="4" fill="${C.g4}"></rect>
  <path d="M70 157l-8 21M270 157l8 21" stroke="${C.g3}" stroke-width="5" stroke-linecap="round"></path>
  <rect x="66" y="124" width="24" height="24" rx="4" fill="${C.g4}"></rect>
  <path d="M90 129h5a5 5 0 0 1 0 10h-5" fill="none" stroke="${C.g4}" stroke-width="3"></path>
  <path d="M73 116c0-4 3-4 3-8M82 116c0-4 3-4 3-8" stroke="${C.g6}" stroke-width="2.4" fill="none" stroke-linecap="round"></path>
  <rect x="116" y="136" width="52" height="12" rx="3" fill="${C.g5}"></rect>
  <rect x="122" y="124" width="40" height="12" rx="3" fill="${C.g6}"></rect>
  <path d="M188 148c2-12 8-18 16-18 5 0 7 3 12 3s7-3 10-3c6 0 8 6 6 18Z" fill="${C.g3}"></path>
  <path d="M196 136c2-4 6-6 8-6" stroke="${C.paper}" stroke-width="2" stroke-linecap="round" fill="none"></path>
  <circle cx="258" cy="112" r="4" fill="${C.g2}"></circle>
  <path d="M258 116v10" stroke="${C.g2}" stroke-width="3"></path>
  <circle cx="258" cy="132" r="7" fill="none" stroke="${C.focal}" stroke-width="4"></circle>
  <path d="M263 137l8 9M268 141l4-3" stroke="${C.focal}" stroke-width="3.5" stroke-linecap="round"></path>
  <circle cx="296" cy="128" r="14" fill="none" stroke="${C.g5}" stroke-width="8"></circle>
  ${DOTS(C,[[80,64,1.6,C.g4],[240,54,1.4,C.g5]])}
  ${GROUND(C)}
  ${CHIP(C,150,108)}`,
mountain:(C,v)=>`
  <path d="M56 178 L 150 62 L 244 178 Z" fill="${C.g6}"></path>
  <path d="M128 90 L 150 62 L 172 90 L 160 86 L 150 96 L 138 86 Z" fill="${C.paper}"></path>
  <path d="M160 178 L 234 92 L 324 178 Z" fill="${C.g5}"></path>
  <circle cx="288" cy="52" r="14" fill="${C.amber}" opacity="0.9"></circle>
  <path d="M96 172 Q 124 130 142 100" fill="none" stroke="${C.g2}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 8"></path>
  <rect x="147" y="30" width="5" height="32" rx="2.5" fill="${C.focal}"></rect>
  <path d="M152 33l27 8-27 8Z" fill="${C.focal}"></path>
  ${v===1?`<rect x="231" y="66" width="4.5" height="26" rx="2.2" fill="${C.focal}"></rect><path d="M235.5 69l22 7-22 7Z" fill="${C.focal}"></path>`:''}
  ${v===2?`<rect x="52" y="96" width="52" height="40" rx="5" fill="${C.paper}" transform="rotate(-3 78 116)"></rect><path d="M62 108h32M62 118h24" stroke="${C.g4}" stroke-width="2.6" stroke-linecap="round" transform="rotate(-3 78 116)"></path><circle cx="78" cy="96" r="4.5" fill="${C.focal}"></circle>`:''}
  ${DOTS(C,[[64,48,1.6,C.g4],[250,40,1.4,C.g5]])}
  ${GROUND(C)}
  ${CHIP(C,196,52)}`
};
