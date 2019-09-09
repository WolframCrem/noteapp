/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        
        window.addEventListener("batterystatus", onBatteryStatus, false);

        

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
            alert('loading files!');
            readFile(fs.root, 'content.txt')
            // alert('file system open: ' + fs.name);
            // var blob = new Blob(["nuggets"], { type: 'text/plain' });
            // saveFile(fs.root, blob, 'hgfjirdhughe5t87h.txt');
        
        });


        alert(cordova.file);
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        alert('Received Event: ' + id);
    },

    
    
};


function readFile(dirEntry, fileName) {

    alert('readFile()')
    /*
    dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {

        alert(fileEntry);
        readFile(fileEntry)
    });
    */
};


function saveFile(dirEntry, fileData, fileName) {

    dirEntry.getFile(fileName, { create: false, exclusive: false }, function (fileEntry) {

        writeFile(fileEntry, fileData);

    });
};
var notified = false;

function onBatteryStatus(status) {
    if(status.level < 10 && notified == false) {
        notified = true;
        navigator.vibrate(3000);
        navigator.notification.alert(
            'Please charge your phone \nthere is ' + status.level + ' Left!',
            alertDismissed,
            'Battery running low',
            'Enable Power-Safe Mode'
        );
        
        document.body.style.backgroundColor = "red";

        // alert("Level: " + status.level + " isPlugged: " + status.isPlugged);
    }
}

function alertDismissed() {
    notified = false;
}

function SaveText() {
    var x = document.getElementById("textPlaceholder").value;
    if(x !== "") {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

            // alert('file system open: ' + fs.name);
            var blob = new Blob([x], { type: 'text/plain' });
            saveFile(fs.root, blob, 'content.txt');
        });
        alert(x);
        /*
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

            alert('file system open: ' + fs.name);
            fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {
        
                alert("fileEntry is file?" + fileEntry.isFile.toString());
                // fileEntry.name == 'someFile.txt'
                // fileEntry.fullPath == '/someFile.txt'
                writeFile(fileEntry, null);
        
            }, onErrorCreateFile);
        
        }, onErrorLoadFs);
        // writeFile();   
        alert('we are here!')
        */
    }
}


function writeFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            alert("Successful file write...");
            alert(readFile(fileEntry));
        };

        fileWriter.onerror = function (e) {
            alert("Failed file write: " + e.toString());
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob(['some file data'], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);
    });
}

function readFile(fileEntry) {

    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {
            alert("Successful file read: " + this.result);
            displayFileData(fileEntry.fullPath + ": " + this.result);
        };

        reader.readAsText(file);

    });
}


app.initialize();