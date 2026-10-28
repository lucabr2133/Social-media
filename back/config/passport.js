import passport from 'passport';
import LocalStrategy from 'passport-local';
import GitHubStrategy from 'passport-github2';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/model/prismamodel.js';

export function configPassport() {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: {
            username
          }
        });

        if (!user && username === 'guestUser') {
          const hashedPassword = await bcrypt.hash('12345678', 10);
          user = await prisma.user.create({
            data: {
              username: 'guestUser',
              password: hashedPassword
            }
          });
        }

        if (!user) return done(null, false, { message: 'User not found' });
        if (!user.password) return done(null, false, { message: 'Password doesnt match ' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return done(null, false, { message: 'Password doesnt match ' });
        return done(null, user);
      } catch (err) {
        console.error('Passport LocalStrategy error:', err);
        return done(err);
      }
    })
  );

  passport.use(
    new GitHubStrategy(
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
                username: profile.username
              }
            });
          }

          return done(null, user);
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );

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
  });
}
