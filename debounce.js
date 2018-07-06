function debounce(_function,delay,immediate)
{
  var timeout;
  return function()
  {
    var context = this, args = arguments;
    var later = function()
    {
      timeout = null;
      if (!immediate) _function.apply(context,args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later,delay);
    if (callNow) _function.apply(context,args);
  };
}