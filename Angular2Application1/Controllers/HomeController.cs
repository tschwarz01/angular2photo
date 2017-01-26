using Microsoft.AspNetCore.Mvc;

namespace Angular2Application1.Controllers
{

    public class HomeController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }
    }
}
