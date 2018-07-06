var AJAX = function()
{
  function http_build_query(data)
  {
    var query = [];
    for (var property in data) query.push(property + '=' + encodeURIComponent(data[property]));
    return query.join('&');
  }

  function isObject(x)
  {
    return x!==null && typeof x=='object';
  }

  function xhr()
  {
    var xhr;
    try
    {
      xhr = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
      try
      {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e2) {
        xhr = false;
      }
    }
    if (!xhr && typeof XMLHttpRequest!='undefined') xhr = new XMLHttpRequest();
    return xhr;
  }

  return {
    file: function(url,fileInput,callback,progress)
    {
      var
        xhr = xhr(),
        file = typeof fileInput=='string' ? document.querySelector(fileInput) : fileInput,
        data = new FormData();
      data.append(file.name,file.files[0]);
      xhr.open('POST',url,true);
      xhr.setRequestHeader('Cache-Control','no-cache');
      if (arguments.length>2) xhr.onreadystatechange = function()
      {
        if (xhr.readyState==4 && xhr.status==200) callback(xhr.responseText);
      };
      if (arguments.length>3) xhr.upload.onprogress = function(event)
      {
        progress(event.loaded,event.total);
      };
      xhr.send(data);
      return xhr;
    },
    get: function(url)
    {
      var data = null, callback = null;
      switch (arguments.length)
      {
        case 2:
          if (isObject(arguments[1])) data = arguments[1]; else callback = arguments[1];
          break;
        case 3:
          data = arguments[1];
          callback = arguments[2];
          break;
      }
      if (data!==null)
      {
        data = http_build_query(data);
        if (data.length>0) url += '?' + data;
      }
      var xhr = xhr();
      xhr.open('GET',url,true);
      if (callback!==null) xhr.onreadystatechange = function()
      {
        if (xhr.readyState==4 && xhr.status==200) callback(xhr.responseText);
      };
      xhr.send(null);
      return xhr;
    },
    post: function(url,data,callback)
    {
      data = arguments.length>1 ? http_build_query(data) : null;
      var xhr = xhr();
      xhr.open('POST',url,true);
      xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      if (arguments.length>2) xhr.onreadystatechange = function()
      {
        if (xhr.readyState==4 && xhr.status==200) callback(xhr.responseText);
      };
      xhr.send(data);
      return xhr;
    }
  };
}();