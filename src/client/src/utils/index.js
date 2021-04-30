function base64ToBlob(base64, mime) {
  mime = mime || '';
  var sliceSize = 1024;
  var byteChars = window.atob(base64);
  var byteArrays = [];

  for (
    var offset = 0, len = byteChars.length;
    offset < len;
    offset += sliceSize
  ) {
    var slice = byteChars.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mime });
}

function parseModerationLabels(labels) {
  /* [
        { Confidence: 75.32240295410156, Name: 'Suggestive', ParentName: '' },
        {
          Confidence: 75.32240295410156,
          Name: 'Barechested Male',
          ParentName: 'Suggestive'
        }
      ] */
  const result = {};
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].ParentName && labels[i].Name) {
      result.ParentName = labels[i].ParentName;
      result.Name = labels[i].Name;
      result.Confidence = labels[i].Confidence.toFixed(2);
      break;
    } else {
      result.Name = labels[i].Name;
      result.Confidence = labels[i].Confidence.toFixed(2);
    }
  }
  console.log('parseModerationLabels', result);

  return result;
}

export { base64ToBlob, parseModerationLabels };
