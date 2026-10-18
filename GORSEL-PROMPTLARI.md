# Petrol Ofisi · CCTV bildirim görselleri için ChatGPT promptları

Her görseli üret, **dosya adını aynen** kullanarak `petrolofisi/public/bildirim/` klasörüne `.jpg` olarak kaydet.
Görsel yüklenene kadar panel o karede dosya adını gösteren bir yer tutucu çizer; yüklediğin anda gerçek görsel görünür.

İsteğe bağlı: Petrol Ofisi logosunu `petrolofisi/public/petrol-ofisi.png` olarak koyarsan üst bardaki kırmızı yazı yerine logo görünür.

---

## Her promptun başına eklenecek ortak stil

```
Photorealistic CCTV security camera still frame, 16:9 landscape, 1672x940. Slightly elevated wide-angle surveillance view with mild fisheye distortion, realistic CCTV sensor noise and compression, natural colors. Location: a modern Petrol Ofisi fuel station in Istanbul, Turkey — red and white canopy with "PO" branding, red fuel dispensers with numbered pump signs, Turkish license plates, Turkish signage. Staff wear dark navy company uniforms with red details and orange-yellow reflective safety vests. Faces are small and not identifiable.
Burned-in camera OSD: top-left black box with white monospace text showing the camera name; top-right black box with white monospace timestamp. AI analytics overlay drawn on top: thin colored bounding boxes with small labels (red = violation, blue = zone/ROI, green = OK), and a semi-transparent dark rounded info panel at bottom-left with short white/green/red text lines. Overlay text must be sharp and spelled exactly as given.
```

Sonra aşağıdaki **Sahne** ve **Overlay** kısımlarını ekle.

---

## ⛽ Pompa operasyonu

### 1 · `arac-pompaya-hatali-yanasti.jpg`
- **Sahne:** Daytime, pump island 2. A white sedan stopped crooked and too far from dispenser "P4"; fuel hose stretched tight across the gap. A dashed blue rectangle on the ground marks the correct docking area; the car is clearly outside it. An attendant stands at another pump, not guiding the car.
- **Overlay:** Kamera `CAM 05 - POMPA ADASI 2`, saat `2026-10-17 17:12:08`. Red box on car: `34 KLM 482`. Blue ground box: `DOCKING ZONE`. Info panel: `Pump: P4` / `Offset: 1.4 m` (red) / `Guidance: NONE` (red)

### 2 · `servis-suresi-sla-asildi.jpg`
- **Sahne:** Late afternoon, busy pump island. One attendant in vest is handling two cars at once at pumps P1 and P2; the driver at P2 waits inside the car looking impatient.
- **Overlay:** `CAM 05 - POMPA ADASI 2`, `2026-10-17 17:48:31`. Box on car at P2 with label `P2 · 06:42`. Box on attendant: `S-02`. Info panel: `Service time: 06:42` (red) / `Target: 04:30` / `Staff: S-02`

### 3 · `pompa-isgali-arac-pompada-birakildi.jpg`
- **Sahne:** Dusk, pump island 3. A dark grey SUV parked at dispenser "P6", nozzle already hung back, driver door closed, nobody in or near the car. Two cars wait behind it in line. The market entrance is visible in the background.
- **Overlay:** `CAM 07 - POMPA ADASI 3`, `2026-10-17 18:21:44`. Thick red box on SUV: `34 RT 7719 · OCCUPYING`. Small orange boxes on the waiting cars: `WAITING`. Info panel: `Pump: P6` / `After nozzle: 09:18` (red) / `Limit: 03:00` / `Waiting cars: 2`

### 4 · `surucu-markete-girdi.jpg`
- **Sahne:** Fuel station convenience store entrance from inside, glass automatic doors; a man in a jacket entering the store from the forecourt. Through the glass the SUV at the pump is visible.
- **Overlay:** `CAM 17 - MARKET GIRIS`, `2026-10-17 18:13:02`. Red box on the man: `Track 418`. Dashed red arrow from the door inward. Info panel: `Track 418` / `Source pump: P6` / `Vehicle: LEFT AT PUMP` (red)

### 5 · `arac-hizmet-bekliyor-personel-yok.jpg`
- **Sahne:** Pump island 3 seen from the opposite side. A silver hatchback waits at pump P5 with the driver inside; no attendant nearby. In the background an attendant in a vest sits on the curb near another pump, looking at a phone.
- **Overlay:** `CAM 08 - POMPA ADASI 3 KARSI`, `2026-10-17 18:31:19`. Orange box on the car: `P5 · WAITING 02:36`. Red box on the sitting attendant: `S-04 · IDLE`. Info panel: `Pump: P5` / `Wait: 02:36` (red) / `Island staff: 0`

---

## 🧽 Cam silme & hizmet

### 6 · `cam-silme-hizmeti-tamamlandi.jpg`
- **Sahne:** Afternoon. Attendant in navy uniform and vest cleaning the windshield of a blue sedan at pump P1 with a squeegee.
- **Overlay:** `CAM 03 - POMPA ADASI 1`, `2026-10-17 17:36:50`. Green box on attendant: `S-01 · WINDOW CLEANING`. Green box on windshield: `WINDSHIELD`. Info panel: `Pump: P1` / `Duration: 00:48` / `Today: 61 windows` (green)

### 7 · `musteri-kendi-camini-siliyor.jpg`
- **Sahne:** A customer (civilian clothes, no vest) cleaning his own windshield with the station squeegee at pump P3. An attendant is busy with another car at the far pump.
- **Overlay:** `CAM 05 - POMPA ADASI 2`, `2026-10-17 18:04:27`. Orange box on customer: `CUSTOMER · SELF WASH`. Box on attendant: `S-02 · BUSY`. Info panel: `Pump: P3` / `Washed by: CUSTOMER` (orange) / `Today: 37 customers`

### 8 · `yakit-katkisi-teklif-edildi.jpg`
- **Sahne:** Attendant at pump P5 holding a small fuel-additive bottle near the open fuel cap of a white car, the driver's window down.
- **Overlay:** `CAM 07 - POMPA ADASI 3`, `2026-10-17 17:58:12`. Green box on attendant: `S-03`. Small green box on bottle: `FUEL ADDITIVE`. Info panel: `Pump: P5` / `Additive: APPLIED` (green) / `Today: 37 vehicles`

---

## 🚗 Kuyruk & personel

### 9 · `pompa-kuyrugu-esik-ustu.jpg`
- **Sahne:** Evening rush. A line of five cars queued at pump P3 (LPG sign visible) while the adjacent island 3 pumps are empty.
- **Overlay:** `CAM 06 - POMPA ADASI 2 KARSI`, `2026-10-17 18:26:05`. Orange boxes numbered `1` to `5` on queued cars. Blue zone on empty island: `ISLAND 3 · FREE`. Info panel: `Pump: P3` / `Queue: 5 cars` (red) / `Avg wait: 03:56` / `Occupancy: 93%`

### 10 · `saha-personeli-yetersiz.jpg`
- **Sahne:** Wide high canopy view of the entire forecourt at rush hour: all 8 pumps busy, many cars, only 4 attendants in vests visible.
- **Overlay:** `CAM 10 - SAHA GENEL KANOPI`, `2026-10-17 17:30:00`. Small green boxes on 4 attendants: `STAFF`. Small cyan boxes on many cars. Info panel: `17:00-18:00` / `Staff on field: 4` (red) / `Vehicles: 132` / `Vehicles / staff: 33` (red)

### 11 · `reflektorlu-yelek-yok.jpg`
- **Sahne:** Attendant in navy uniform but **without** a reflective vest refueling a car; another attendant in the background wears a vest for contrast.
- **Overlay:** `CAM 04 - POMPA ADASI 1 KARSI`, `2026-10-17 16:44:21`. Red box: `S-02 · NO VEST`. Green box on background attendant: `VEST OK`. Info panel: `Staff: S-02` / `Vest: MISSING` (red) / `Uniform: OK` (green)

### 12 · `firma-kiyafeti-uyumsuz.jpg`
- **Sahne:** Attendant wearing a plain brown civilian jacket instead of the company uniform, with a reflective vest on top, at a pump.
- **Overlay:** `CAM 07 - POMPA ADASI 3`, `2026-10-17 16:09:48`. Red box: `S-04 · NON-COMPLIANT UNIFORM`. Info panel: `Staff: S-04` / `Uniform: NON-COMPLIANT` (red) / `Vest: OK` (green)

---

## 🚛 Tanker

### 13 · `tanker-giris-yapti-plaka-okundu.jpg`
- **Sahne:** A fuel tanker truck (white tank, red stripes, hazard placards) entering the station from the side road; rear plate clearly visible.
- **Overlay:** `CAM 12 - TANKER PLAKA`, `2026-10-17 14:02:16`. Green box on plate with zoomed inset: `34 TNK 905`. Info panel: `Plate: 34 TNK 905` / `Entry: 14:02:16` / `OCR: 98%` (green)

### 14 · `bosaltmada-emniyet-konisi-eksik.jpg`
- **Sahne:** Tanker parked over the underground tank fill points, hoses connected and unloading. No traffic cones or safety tape around the area; a car passes close by.
- **Overlay:** `CAM 11 - TANKER BOSALTMA ALANI`, `2026-10-17 14:09:40`. Blue dashed rectangle around unloading zone: `UNLOADING ZONE`. Four small red empty markers at corners: `CONE?`. Info panel: `Cones: 0 / 4` (red) / `Safety tape: NONE` (red) / `Unloading: ACTIVE`

### 15 · `yangin-sondurucu-yerinde-degil.jpg`
- **Sahne:** Same unloading scene; an empty marked spot on the ground where the wheeled fire extinguisher should stand (outlined red floor marking, nothing on it).
- **Overlay:** `CAM 11 - TANKER BOSALTMA ALANI`, `2026-10-17 14:10:02`. Red box on empty spot: `EXTINGUISHER MISSING`. Info panel: `Extinguisher: NOT FOUND` (red) / `Expected: 2 x 50 kg` / `Unloading: ACTIVE`

### 16 · `bosaltma-basinda-personel-yok.jpg`
- **Sahne:** Tanker unloading with hoses connected, nobody standing at the fill point; the truck driver visible sitting in the cab.
- **Overlay:** `CAM 11 - TANKER BOSALTMA ALANI`, `2026-10-17 14:24:51`. Blue zone: `UNLOADING ZONE · NO STAFF`. Orange box on cab: `DRIVER IN CAB`. Info panel: `Unattended: 04:12` (red) / `Driver: IN CAB` / `Unloading: ACTIVE`

### 17 · `tanker-bosaltma-tamamlandi.jpg`
- **Sahne:** Tanker driving out of the station exit, hoses stowed.
- **Overlay:** `CAM 12 - TANKER PLAKA`, `2026-10-17 14:46:33`. Green box on plate: `34 TNK 905 · EXIT`. Info panel: `Unloading: 36 min` (green) / `On site: 44 min` / `Exit: 14:46:33`

---

## 🔥 Yangın

### 19 · `market-arkasinda-alev-belirtisi.jpg`
- **Sahne:** Behind the convenience store, a waste container with small visible flames and smoke rising; an attendant running toward it with a red fire extinguisher.
- **Overlay:** `CAM 15 - MARKET ARKASI`, `2026-10-17 12:51:07`. Red box on flames: `FLAME 88%`. Green box on attendant: `RESPONSE`. Info panel: `Area: Behind Market` / `Detection: FLAME` (red) / `Response: 01:40`

---

## ⛔ Yasaklı alan & gece

### 20 · `tank-sahasina-yetkisiz-giris.jpg`
- **Sahne:** Fenced underground tank area with manhole covers and vent pipes; a person in civilian clothes (no vest) walking inside the restricted area.
- **Overlay:** `CAM 13 - TANK SAHASI`, `2026-10-17 16:58:30`. Semi-transparent red polygon ROI on the ground: `RESTRICTED AREA`. Red box on person: `Track 233`. Info panel: `Area: Tank Field` / `Dwell: 02:14` (red) / `Vest: NONE` (red)

### 21 · `depoya-yetkisiz-giris.jpg`
- **Sahne:** Storage room door at the side of the store standing open, a customer stepping inside among stacked boxes and oil cans.
- **Overlay:** `CAM 16 - DEPO`, `2026-10-17 15:37:04`. Red ROI on doorway: `STAFF ONLY`. Red box: `Track 157`. Info panel: `Area: Storage` / `Door open: 06:20` (red)

### 22 · `mesai-disi-supheli-bekleme.jpg`
- **Sahne:** Night, infrared/low-light grainy image behind the store. A car with headlights off parked near the back door, two people standing beside the storage door.
- **Overlay:** `CAM 15 - MARKET ARKASI`, `2026-10-17 03:12:44`. Red box on car: `PLATE UNREADABLE`. Red boxes on two people: `PERSON 1`, `PERSON 2`. Info panel: `After hours` / `Loitering: 11:40` (red) / `Persons: 2`

---

## 📋 Saha düzeni

### 23 · `pompaya-mont-asilmis.jpg`
- **Sahne:** Close-mid view of dispenser P4 with a dark jacket hung over the nozzle holder / pump body.
- **Overlay:** `CAM 06 - POMPA ADASI 2 KARSI`, `2026-10-17 16:21:15`. Red box on jacket: `JACKET ON PUMP`. Info panel: `Pump: P4` / `Object: JACKET` (red) / `Duration: 2:19`

### 24 · `personel-pompa-dibinde-oturuyor.jpg`
- **Sahne:** Attendant in vest sitting on the concrete island base right next to pump P6, while a car waits at P5 behind him.
- **Overlay:** `CAM 07 - POMPA ADASI 3`, `2026-10-17 18:28:40`. Red box: `S-04 · SITTING`. Orange box on waiting car: `P5 WAITING`. Info panel: `Staff: S-04` / `Pump: P6` / `Sitting: 07:52` (red)

---

## 💸 Drive-off

### 25 · `yakit-alimi-tamamlandi-odeme-bekleniyor.jpg`
- **Sahne:** Red hatchback at pump P2, nozzle just hung up, driver still seated inside, engine on; attendant walking away.
- **Overlay:** `CAM 03 - POMPA ADASI 1`, `2026-10-17 17:52:03`. Orange box on car: `06 BZK 341`. Info panel: `Pump: P2` / `Amount: 2.850 TL` / `Market entry: NONE` (orange)

### 26 · `odemeden-kacma-drive-off.jpg`
- **Sahne:** Station exit lane; the same red hatchback accelerating out onto the road, rear plate visible.
- **Overlay:** `CAM 02 - CIKIS PLAKA`, `2026-10-17 17:53:21`. Thick red box with plate inset: `06 BZK 341 · DRIVE-OFF`. Dashed red arrow toward the road. Info panel: `Plate: 06 BZK 341` / `Amount: 2.850 TL` (red) / `POS: NO PAYMENT` (red)

---

## 🛒 Müşteri & market

### 27 · `kasa-kuyrugu-esik-ustu.jpg`
- **Sahne:** Inside a fuel station convenience store, six customers queuing at checkout 1; checkout 2 is unstaffed and closed.
- **Overlay:** `CAM 18 - MARKET KASA 1`, `2026-10-17 18:18:09`. Blue zone: `CASHIER 1`. Orange boxes numbered `1`-`6` on customers. Gray zone: `CASHIER 2 · CLOSED`. Info panel: `Queue: 6` (red) / `Wait: 04:20` / `Cashier 2: CLOSED`

### 28 · `kasa-basinda-personel-yok.jpg`
- **Sahne:** Checkout 2 with no cashier behind the counter, two customers waiting with products in hand.
- **Overlay:** `CAM 19 - MARKET KASA 2`, `2026-10-17 16:33:52`. Red zone behind counter: `NO CASHIER`. Info panel: `Cashier: Kasa 2` / `Unstaffed: 03:05` (red) / `Waiting: 2`

### 29 · `lavabo-temizligi-gecikti.jpg`
- **Sahne:** Corridor leading to restroom doors (men / women signs), people walking in; no cleaning staff present; a cleaning schedule sign on the wall. Camera shows only the corridor, not inside restrooms.
- **Overlay:** `CAM 22 - LAVABO KORIDORU`, `2026-10-17 18:00:00`. Blue line across corridor: `ENTRY LINE`. Info panel: `Planned: 17:00` / `Last cleaning: 16:02` / `Delay: 60 min` (red) / `Uses: 214`

### 30 · `ist-yogunluk-zirvesi.jpg`
- **Sahne:** Station entrance road with many cars entering, mix of sedans, SUVs, a van and a truck.
- **Overlay:** `CAM 01 - GIRIS PLAKA`, `2026-10-17 18:10:00`. Small cyan boxes on vehicles labeled `CAR`, `SUV`, `VAN`, `TRUCK`. Blue counting line: `IN`. Info panel: `Vehicles in: 132` / `Fueled: 111 · 84%` (green) / `Market: 96`

### 31 · `oto-yikama-kuyrugu.jpg`
- **Sahne:** Automatic car wash bay at the station, one car inside under brushes and three cars waiting outside.
- **Overlay:** `CAM 23 - OTO YIKAMA`, `2026-10-17 15:48:26`. Green box inside bay: `WASHING 08:40`. Orange boxes on waiting cars: `QUEUE 1-3`. Info panel: `Queue: 3` / `Wash time: 08:40` / `Today: 41`

---

## 📷 Kamera sağlığı

### 32 · `kamera-acisi-kaydi.jpg`
- **Sahne:** Pump island view that is visibly tilted and shifted — the frame now shows mostly the canopy roof and sky; pump P6 nozzle area cut off at the bottom edge. A faint ghosted outline shows the original reference view.
- **Overlay:** `CAM 07 - POMPA ADASI 3`, `2026-10-17 17:04:12`. Yellow warning banner: `SCENE CHANGED`. Info panel: `Camera: CAM-07` / `Reference match: 61%` (orange) / `Analytics: LOW`

### 33 · `kamera-goruntusu-kirlendi.jpg`
- **Sahne:** Pump island view seen through a dirty, dusty, smeared lens — blurry blotches and haze over half the image.
- **Overlay:** `CAM 04 - POMPA ADASI 1 KARSI`, `2026-10-17 15:22:40`. Yellow warning banner: `LENS DIRTY`. Info panel: `Camera: CAM-04` / `Sharpness: 54%` (orange) / `Analytics: DEGRADED`

### 34 · `kamera-baglantisi-koptu.jpg`
- **Sahne:** Almost entirely black/grey "no signal" CCTV frame with faint digital noise and a frozen, corrupted partial image of an electrical/generator room.
- **Overlay:** `CAM 14 - JENERATOR / ELEKTRIK ODASI`, `2026-10-17 18:02:33`. Centered red text box: `NO SIGNAL`. Info panel: `Camera: CAM-14` / `Status: OFFLINE` (red) / `Duration: 38 min`

---

### İpuçları
- ChatGPT bazen yazıları bozar; overlay metni hatalıysa "Keep the image, only fix the overlay text to exactly: …" diye düzelttir.
- Aynı olay zincirindeki kareler (3–4 P6 işgali, 13–17 tanker, 25–26 drive-off) için aynı aracı korumasını iste: "Same vehicle and same station as the previous image."
- Plakalar ve kişiler kurgusaldır; gerçek kişi ya da plaka kullanma.
