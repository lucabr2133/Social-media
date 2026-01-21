import passport from 'passport';
import LocalStrategy from 'passport-local';
import GitHubStrategy from 'passport-github2';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/model/prismamodel.js';


  // const opts = {
  //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //   secretOrKey: 'este es mi secreto'
  // };

  export function configPassport(){
  //   passport.use(
  //   new JwtStrategy(opts, async (jwtPayload, done) => {

  //     try {
  //       // Busca el usuario por el ID que está en el JWT
  //       const user = await prisma.user.findUnique({
  //         where: { id: jwtPayload.id } // 'id' debe ser del tipo String
  //       });

  //       if (user) {
  //         return done(null, user); // Autenticación exitosa
  //       } else {
  //         return done(null, false); // Usuario no encontrado
  //       }
  //     } catch (error) {
  //       return done(error, false); // Error en la consulta
  //     }
  //   })
  // );
passport.use(new LocalStrategy(async (username, password, done) => {
    
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  });

  if (!user) return done(null, false, { message: 'User not found' });
  const isMatch =  await bcrypt.compare(password, user.password);

  if (!isMatch) return done(null, false, { message: 'Password doesnt match ' });
  return done(null, user);
}));
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENTID,
    clientSecret: process.env.GITHUB_CLIENTSECRET,
    callbackURL: process.env.GITHUB_AUTHCALLBACK
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await prisma.user.findUnique({
        where: { githubId: profile.id }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            githubId: profile.id,
            username: profile.username,
            
          }
        });
      }

      return done(null, user); // ✅ SIEMPRE un user válido
    } catch (err) {
      console.error(err);
      return done(err); // ❌ solo si hay error real
    }
  }
));

passport.serializeUser((user, done) => {
  return done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});}
