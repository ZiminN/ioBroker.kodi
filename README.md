![Logo](admin/kodi.png)
# Kodi's JSON-RPC API for IoBroker
You can find kodi's official documentation of the JSON-RCP API [here](http://kodi.wiki/view/JSON-RPC_API) and the full list of available commands (for protocol version 6) [here](http://kodi.wiki/view/JSON-RPC_API/v6).

## Using
###ShowNotif: 
Один важный момент, если используется заголовок сообщения, то он должен всегда находится перед самим текстом сообщения (Внимание;Протечка воды), расположение остальных параметров не критично.
####Image:
Уровень сообщения
  * 'info' - 0 (default),
  * 'warning' - 1,
  * 'error' - 2.

####displaytime:
Время отображения сообщения в милисекундах, минимум 1500 макс 30000 мс.

Пример: 
 * 1;Внимание;Протечка воды;15000
 * Внимание;Протечка воды;2;10000
 * Внимание;Протечка воды
 * Протечка воды

Так же сообщения можно отправлять из javascript:
```
sendTo("kodi.0", {
    message:  'Возможно протечка воды ',
    title:    'ВНИМАНИЕ!!!',
    image: 'https://raw.githubusercontent.com/instalator/ioBroker.kodi/master/admin/kodi.png',
    delay: ''
});
```
###SwitchPVR: 
Переключение PVR IPTV каналов по названию канала в плейлисте.
Пример:
	ТВ канал - Discovery Science найдет как по полному наименованию так и по discover,

## Changelog

#### 0.0.6 (2016-05-08)
* (bluefox) fixed crash when the driver turned on the KODI
* (bluefox) make adapter disabled by default, because no IP set
* (instalator) Thumbnail widget
* (instalator) added GetDirectory, GetVideoLibrary
* (instalator) added Scan & Clean Library

#### 0.0.5 (2016-05-04)
* (instalator) change creating object
* (instalator) added info.connection state

#### 0.0.4 (2016-05-03)
* (instalator) fix error
* (instalator) added VIS widgets

#### 0.0.3 (2016-05-01)
* (instalator) fix error
* (instalator) added send message from JS

#### 0.0.2 (2016-04-24)
* (instalator) remote player
* (instalator) ShowNotification
* (instalator) info playing
* (instalator) GetPVRChannel

#### 0.0.1
* (instalator) initial (17.04.2016)
