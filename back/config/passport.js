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
    console.log(username,password);
    
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  });

  if (!user) return done(null, false, { message: 'User not found' });
  const isMatch =  bcrypt.compare(password, user.password);

  if (!isMatch) return done(null, false, { message: 'Password doesnt match ' });
  return done(null, user);
}));
passport.use(new GitHubStrategy({
  clientID: 'Ov23ligGhkwNuOc4TmWH',
  clientSecret: '84e3cf9493bb6df29e841e5e3540f897c0701ae8',
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const user = await prisma.user.findUnique({
    where: {
      githubId: profile.id
    }
  });
  return done(null, user);
}
));
passport.serializeUser((user, done) => {
  return done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  return done(null, user);
});}