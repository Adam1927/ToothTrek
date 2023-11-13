import 'package:flutter/material.dart';

import 'initial_pages_background.dart';
import 'widget_util.dart';

import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class Authentication extends StatelessWidget {
  final bool isSigningUp;
  const Authentication({Key? key, required this.isSigningUp}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size screenSize = MediaQuery.of(context).size;
    bool isDesktop = screenSize.width > 800;
    double textFieldWidthFactor = isDesktop ? 0.4 : 0.7;
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Stack(
        alignment: Alignment.topCenter,
        children: [
          const InitialPageBackground(),
          //wrapped a scroll view with a container to make it scrollable
          Container(
            margin: EdgeInsets.only(
                //add margin equal to the size of keyboard to allow scrolling
                bottom: MediaQuery.of(context).viewInsets.bottom),
            child: SingleChildScrollView(
              child: Column(
                children: [
                  SizedBox(
                    // 20% of screen height
                    height: screenSize.height * 0.2,
                  ),
                  Text(
                      isSigningUp
                          ? AppLocalizations.of(context)!.initial_signUpButton
                          : AppLocalizations.of(context)!.initial_logInButton,
                      style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurface,
                          fontSize: 50,
                          fontFamily: "suezone")),
                  SizedBox(
                    // 4% of screen height
                    height: screenSize.height * 0.04,
                  ),
                  createTextField(
                      screenSize.width * textFieldWidthFactor,
                      screenSize.height * 0.07,
                      AppLocalizations.of(context)!.authentication_enterEmail,
                      context,
                      false),
                  SizedBox(
                    height: screenSize.height * 0.04,
                  ),
                  createTextField(
                      screenSize.width * textFieldWidthFactor,
                      screenSize.height * 0.07,
                      AppLocalizations.of(context)!
                          .authentication_enterPassword,
                      context,
                      true),
                  SizedBox(
                    height: screenSize.height * 0.04,
                  ),
                  if (isSigningUp)
                    createTextField(
                        screenSize.width * textFieldWidthFactor,
                        screenSize.height * 0.07,
                        AppLocalizations.of(context)!
                            .authentication_confirmPassword,
                        context,
                        true),
                  SizedBox(
                    height: screenSize.height * 0.04,
                  ),
                  Material(
                    elevation: 7,
                    borderRadius: BorderRadius.circular(30.0),
                    shadowColor: Theme.of(context).colorScheme.shadow,
                    child: WidgetUtil.createBTN(
                      context,
                      Theme.of(context).colorScheme.onPrimaryContainer,
                      const Size(230, 74),
                      Theme.of(context).colorScheme.primaryContainer,
                      () => onPressed(context),
                      AppLocalizations.of(context)!
                          .authentication_confirmButton,
                    ),
                  )
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  TextField createTextField(double width, double height, String prompt,
      BuildContext context, bool obscureText) {
    return TextField(
        // obscure the text in the password field
        obscureText: obscureText,
        decoration: InputDecoration(
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(20)),
          fillColor: Theme.of(context).colorScheme.surface,
          constraints: BoxConstraints(maxWidth: width, maxHeight: height),
          filled: true,
          labelText: prompt,
        ));
  }

  //TODO send request to express server
  onPressed(BuildContext context) {}
}
