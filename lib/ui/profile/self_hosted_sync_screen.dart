import 'package:flutter/material.dart';

import '../../self_hosted/self_hosted_sync.dart';
import '../../theme/theme.dart';
import '../../theme/tokens.dart';
import '../kit/kit.dart';

class SelfHostedSyncScreen extends StatefulWidget {
  const SelfHostedSyncScreen({super.key});

  @override
  State<SelfHostedSyncScreen> createState() => _SelfHostedSyncScreenState();
}

class _SelfHostedSyncScreenState extends State<SelfHostedSyncScreen> {
  final _settings = SelfHostedSyncSettings();
  late final SelfHostedSyncService _service = SelfHostedSyncService(_settings);
  final _url = TextEditingController();
  final _token = TextEditingController();
  bool _loaded = false;
  bool _busy = false;
  bool _consent = false;
  bool _allowHttp = false;
  SelfHostedSyncScope _scope = SelfHostedSyncScope.derived;
  String? _status;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    await _settings.load();
    _url.text = _settings.baseUrl;
    _token.text = _settings.apiToken ?? '';
    _consent = _settings.consented;
    _allowHttp = _settings.allowLocalHttp;
    _scope = _settings.scope;
    if (_settings.consented && _settings.baseUrl.isNotEmpty) {
      try {
        await _service.retryPending();
      } catch (_) {
        // Status below explains the retained outbox; local app use is unaffected.
      }
    }
    _status = await _service.status();
    if (mounted) setState(() => _loaded = true);
  }

  Future<void> _save({bool upload = false}) async {
    setState(() {
      _busy = true;
      _status = null;
    });
    try {
      await _settings.save(
        url: _url.text,
        token: _token.text,
        consent: _consent,
        localHttp: _allowHttp,
        uploadScope: _scope,
      );
      if (upload) await _service.enqueueAndUpload();
      _status = upload ? await _service.status() : 'Settings saved.';
    } catch (e) {
      _status = '$e';
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  void dispose() {
    _service.close();
    _url.dispose();
    _token.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(title: const Text('Self-hosted sync')),
      body: !_loaded
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(Sp.screen),
              children: [
                Text(
                  'Your on-device SQLite database remains the source of truth. '
                  'This optional mirror never blocks band sync or analytics.',
                  style: AppText.body,
                ),
                const SizedBox(height: Sp.x5),
                TextField(
                  controller: _url,
                  keyboardType: TextInputType.url,
                  autocorrect: false,
                  decoration: const InputDecoration(
                    labelText: 'Backend base URL',
                    hintText: 'https://stasis.example.com',
                  ),
                ),
                const SizedBox(height: Sp.x3),
                TextField(
                  controller: _token,
                  obscureText: true,
                  autocorrect: false,
                  decoration: const InputDecoration(
                    labelText: 'Bearer token (optional)',
                  ),
                ),
                SwitchListTile.adaptive(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Allow private-network HTTP'),
                  subtitle: const Text(
                    'For local development only. Production should use HTTPS.',
                  ),
                  value: _allowHttp,
                  onChanged: (v) => setState(() => _allowHttp = v),
                ),
                const SectionHeader('Upload scope'),
                RadioGroup<SelfHostedSyncScope>(
                  groupValue: _scope,
                  onChanged: (v) => setState(() => _scope = v ?? _scope),
                  child: const Column(
                    children: [
                      RadioListTile(
                        value: SelfHostedSyncScope.derived,
                        title: Text('Derived health views'),
                        subtitle: Text(
                          'Recommended. No raw sensor rows or GPS routes.',
                        ),
                      ),
                      RadioListTile(
                        value: SelfHostedSyncScope.fullDatabase,
                        title: Text('Full SQLite database'),
                        subtitle: Text(
                          'Includes raw health records. Use only on infrastructure you control.',
                        ),
                      ),
                    ],
                  ),
                ),
                SwitchListTile.adaptive(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('I consent to health-data upload'),
                  subtitle: const Text(
                    'Off by default. Nothing uploads until enabled and Sync now is tapped.',
                  ),
                  value: _consent,
                  onChanged: (v) => setState(() => _consent = v),
                ),
                if (_status != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: Sp.x3),
                    child: Text(_status!, style: AppText.captionMuted),
                  ),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _busy ? null : () => _save(),
                        child: const Text('Save'),
                      ),
                    ),
                    const SizedBox(width: Sp.x3),
                    Expanded(
                      child: FilledButton(
                        onPressed: _busy ? null : () => _save(upload: true),
                        child: Text(_busy ? 'Working…' : 'Sync now'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
    );
  }
}
