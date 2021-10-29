const webdav = require('webdav-server').v2;
const server = new webdav.WebDAVServer({port: 3000});
const express = require('express');
const app = require('express')();
const fs = require('fs');
const {createClient} = require('webdav');
const webDAVClient = createClient('https://webdav.yandex.ru', { username: 'z2z4z71', password: 'exhslsaeezdapalw'});
const multer = require('multer');
app.use(express.static('public'));
app.use(multer().single("file"));

server.setFileSystem('/', new webdav.PhysicalFileSystem('./files'), (success) =>
{
    server.start(() =>
    {
        console.log('READY');
    });
    app.listen(1998);
});


app.post('/makeDir/[A-z,0-9,%,/,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    console.log(s);
    let dirName = decodeURI(s);
    webDAVClient.exists(dirName).then((result) =>
    {
        if (!result)
        {
            webDAVClient.createDirectory(dirName);
            res.end('Директория создана успешно');
        }
        else
        {
            //res.writeHead(408,{'Content-Type': 'text/plain;charset=utf-8'})
            res.end('Такая директория уже существует');
        }
    })
    .catch((err) =>
    {
        console.log(err);
    });
});


app.post('/readDir/[A-z,0-9,%,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let requiredDir = decodeURI(s);
    webDAVClient.exists(requiredDir).then((result) =>
    {
        if (result)
        {
            webDAVClient.deleteFile(requiredDir);
            res.end('Директория удалена успешно');
        }
        else
        {
            //res.writeHead(408,{'Content-Type': 'text/plain;charset=utf-8'})
            res.end('Такой директории не существует');
        }
    })
    .catch((err) =>
    {
        console.log(err);
    });
});


app.post('/uploadFile/[A-z,0-9,%,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let uploadFileName = decodeURI(s);
    console.log(req.file);
    try {
        let rs = fs.createReadStream('./files/' + uploadFileName);
        webDAVClient.exists(uploadFileName).then((result)=>{
            if(result){
                webDAVClient.deleteFile(uploadFileName);
            }
        });
        let ws = webDAVClient.createWriteStream(uploadFileName);
        rs.pipe(ws);
        res.end('Файл успешно выгружен');
    }
    catch (err)
    {
        console.log(err);
        res.writeHead(408,{'Content-Type': 'text/plain;charset=utf-8'})
        res.end('Ошибка записи');
    }
});


app.post('/downloadFile/[A-z,0-9,%,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let downloadFileName = decodeURI(s);
    webDAVClient.exists(downloadFileName).then((result) => {
        if (result)
        {
            webDAVClient.createReadStream(downloadFileName).pipe(fs.createWriteStream(`./files/${downloadFileName}.jpg`));
            res.end('Файл успешно скачан');
        } else {
            //res.writeHead(404,{'Content-Type': 'text/plain;charset=utf-8'})
            res.end('Такого файла не существует');
        }
    })
        .catch((err) => {
            console.log(err);
        })
});


app.post('/deleteFile/[A-z,0-9,%,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let deleteFileName = decodeURI(s);
    webDAVClient.exists(deleteFileName).then((result) =>
    {
        if (result)
        {
            webDAVClient.deleteFile(deleteFileName);
            res.end('Файл удален успешно');
        }
        else
        {
            //res.writeHead(404,{'Content-Type': 'text/plain;charset=utf-8'})
            res.end('Такого файла не существует');
        }
    })
    .catch((err) =>
    {
        console.log(err);
    })
});


app.post('/copyFile/[A-z,0-9,%,.]+/[A-z,0-9,%,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let d = '/' + req.url.split('/')[3];
    let fileName = decodeURI(s);
    let destination = decodeURI(d);
    webDAVClient.exists(fileName).then((result) =>
    {
        if (result)
        {
            webDAVClient.copyFile(fileName, destination);
            res.end('Файл скопирован успешно');
        }
        else
        {
            //res.writeHead(404,{'Content-Type': 'text/plain;charset=utf-8'})
            res.end('Такого файла не существует');
        }
    })
    .catch((err) =>
    {
        console.log(err);
    })
});


app.post('/moveFile/[A-z,0-9,%,.]+/[A-z,0-9,%,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let d = '/' + req.url.split('/')[3];
    let source = decodeURI(s);
    let destination = decodeURI(d);
    webDAVClient.exists(source).then((result) =>
    {
        if (result)
        {
            webDAVClient.moveFile(source, destination);
            res.end('Файл перемещен успешно');
        }
        else
        {
            //res.writeHead(404,{'Content-Type': 'text/plain;charset=utf-8'})
            res.end('Такого файла не существует');
        }
    })
        .catch((err) => {
            console.log(err);
        })
});