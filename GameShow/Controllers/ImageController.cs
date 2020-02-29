using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QRCoder;

namespace GameShow.Controllers
{
    [Route("[controller]")]
    public class ImageController : Controller
    {

        [HttpGet("[action]")]
        public ActionResult QrCode()
        {
            string url = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

            QRCodeGenerator qrGen = new QRCodeGenerator();
            QRCodeData qrData = qrGen.CreateQrCode(url, QRCodeGenerator.ECCLevel.H);

            PngByteQRCode qrCode = new PngByteQRCode(qrData);
            byte[] qrCodeAsPngByteArr = qrCode.GetGraphic(20);

            return File(qrCodeAsPngByteArr, "application/octet-stream");
        }
    }
}