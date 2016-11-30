using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MafiaGame.Startup))]
namespace MafiaGame
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
